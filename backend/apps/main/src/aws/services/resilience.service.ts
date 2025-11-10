import { Injectable, Logger } from '@nestjs/common';

export interface RetryOptions {
  maxRetries: number;
  delay: number;
  backoffMultiplier: number;
  maxDelay: number;
}

export interface CircuitBreakerOptions {
  failureThreshold: number;
  resetTimeout: number;
  monitoringPeriod: number;
}

export class CircuitBreakerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CircuitBreakerError';
  }
}

@Injectable()
export class ResilienceService {
  private readonly logger = new Logger(ResilienceService.name);
  private circuitBreakers = new Map<string, {
    state: 'closed' | 'open' | 'half-open';
    failureCount: number;
    lastFailureTime: number;
    successCount: number;
    options: CircuitBreakerOptions;
  }>();

  /**
   * Retry mechanism with exponential backoff
   */
  async withRetry<T>(
    operation: () => Promise<T>,
    options: Partial<RetryOptions> = {}
  ): Promise<T> {
    const config = {
      maxRetries: 3,
      delay: 1000,
      backoffMultiplier: 2,
      maxDelay: 30000,
      ...options,
    };

    let lastError: Error;
    let delay = config.delay;

    for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === config.maxRetries) {
          this.logger.error(`Operation failed after ${config.maxRetries + 1} attempts:`, error);
          break;
        }

        // Don't retry on certain errors
        if (this.isNonRetryableError(error)) {
          this.logger.warn('Non-retryable error encountered:', error);
          throw error;
        }

        this.logger.warn(`Attempt ${attempt + 1} failed, retrying in ${delay}ms:`, error);
        
        await new Promise(resolve => setTimeout(resolve, delay));
        delay = Math.min(delay * config.backoffMultiplier, config.maxDelay);
      }
    }

    throw lastError!;
  }

  /**
   * Circuit breaker pattern
   */
  async withCircuitBreaker<T>(
    key: string,
    operation: () => Promise<T>,
    options: Partial<CircuitBreakerOptions> = {}
  ): Promise<T> {
    const config = {
      failureThreshold: 5,
      resetTimeout: 60000,
      monitoringPeriod: 10000,
      ...options,
    };

    let breaker = this.circuitBreakers.get(key);
    if (!breaker) {
      breaker = {
        state: 'closed',
        failureCount: 0,
        lastFailureTime: 0,
        successCount: 0,
        options: config,
      };
      this.circuitBreakers.set(key, breaker);
    }

    // Check if circuit should be reset
    if (breaker.state === 'open' && 
        Date.now() - breaker.lastFailureTime > config.resetTimeout) {
      breaker.state = 'half-open';
      breaker.successCount = 0;
      this.logger.log(`Circuit breaker ${key} moved to half-open state`);
    }

    // Reject if circuit is open
    if (breaker.state === 'open') {
      throw new CircuitBreakerError(`Circuit breaker ${key} is open`);
    }

    try {
      const result = await operation();
      
      // Success in half-open state
      if (breaker.state === 'half-open') {
        breaker.successCount++;
        if (breaker.successCount >= 3) {
          breaker.state = 'closed';
          breaker.failureCount = 0;
          this.logger.log(`Circuit breaker ${key} closed after successful recovery`);
        }
      } else {
        // Reset failure count on success
        breaker.failureCount = 0;
      }

      return result;
    } catch (error) {
      breaker.failureCount++;
      breaker.lastFailureTime = Date.now();

      // Open circuit if threshold exceeded
      if (breaker.failureCount >= config.failureThreshold) {
        breaker.state = 'open';
        this.logger.error(`Circuit breaker ${key} opened after ${breaker.failureCount} failures`);
      }

      throw error;
    }
  }

  /**
   * Combine retry with circuit breaker
   */
  async withResilientExecution<T>(
    key: string,
    operation: () => Promise<T>,
    retryOptions: Partial<RetryOptions> = {},
    circuitBreakerOptions: Partial<CircuitBreakerOptions> = {}
  ): Promise<T> {
    return this.withCircuitBreaker(
      key,
      () => this.withRetry(operation, retryOptions),
      circuitBreakerOptions
    );
  }

  /**
   * Timeout wrapper
   */
  async withTimeout<T>(
    operation: () => Promise<T>,
    timeoutMs: number
  ): Promise<T> {
    return Promise.race([
      operation(),
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error(`Operation timed out after ${timeoutMs}ms`)), timeoutMs)
      ),
    ]);
  }

  /**
   * Bulkhead pattern - limit concurrent executions
   */
  private semaphores = new Map<string, {
    count: number;
    max: number;
    queue: Array<{ resolve: () => void; reject: (error: Error) => void }>;
  }>();

  async withBulkhead<T>(
    key: string,
    operation: () => Promise<T>,
    maxConcurrent: number = 5
  ): Promise<T> {
    let semaphore = this.semaphores.get(key);
    if (!semaphore) {
      semaphore = {
        count: 0,
        max: maxConcurrent,
        queue: [],
      };
      this.semaphores.set(key, semaphore);
    }

    // Wait for available slot
    if (semaphore.count >= semaphore.max) {
      await new Promise<void>((resolve, reject) => {
        semaphore!.queue.push({ resolve, reject });
      });
    }

    semaphore.count++;

    try {
      const result = await operation();
      return result;
    } finally {
      semaphore.count--;
      
      // Process queue
      if (semaphore.queue.length > 0) {
        const next = semaphore.queue.shift();
        if (next) {
          next.resolve();
        }
      }
    }
  }

  /**
   * Health check for circuit breakers
   */
  getCircuitBreakerStatus(): Record<string, {
    state: string;
    failureCount: number;
    lastFailureTime: number;
    successCount: number;
  }> {
    const status: Record<string, any> = {};
    
    for (const [key, breaker] of this.circuitBreakers.entries()) {
      status[key] = {
        state: breaker.state,
        failureCount: breaker.failureCount,
        lastFailureTime: breaker.lastFailureTime ? new Date(breaker.lastFailureTime).toISOString() : null,
        successCount: breaker.successCount,
      };
    }

    return status;
  }

  /**
   * Reset circuit breaker manually
   */
  resetCircuitBreaker(key: string): boolean {
    const breaker = this.circuitBreakers.get(key);
    if (breaker) {
      breaker.state = 'closed';
      breaker.failureCount = 0;
      breaker.successCount = 0;
      breaker.lastFailureTime = 0;
      this.logger.log(`Circuit breaker ${key} manually reset`);
      return true;
    }
    return false;
  }

  private isNonRetryableError(error: any): boolean {
    // Don't retry on authentication errors
    if (error.name === 'CredentialsError' || error.name === 'UnauthorizedError') {
      return true;
    }

    // Don't retry on validation errors
    if (error.name === 'ValidationError' || error.statusCode === 400) {
      return true;
    }

    // Don't retry on not found errors
    if (error.statusCode === 404) {
      return true;
    }

    // Don't retry on rate limit errors (let the rate limiter handle it)
    if (error.statusCode === 429) {
      return true;
    }

    return false;
  }
}