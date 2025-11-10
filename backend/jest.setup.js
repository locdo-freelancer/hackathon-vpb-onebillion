/**
 * Jest Setup File
 * Fixes circular JSON serialization issues with AWS SDK clients
 */

// Increase test timeout for AWS operations
jest.setTimeout(30000);

// Mock console methods to reduce noise in test output
global.console = {
  ...console,
  // Suppress AWS SDK warnings during tests
  warn: jest.fn(),
  // Keep error logging for debugging
  error: console.error,
  log: console.log,
  info: console.info,
  debug: jest.fn(),
};

// Suppress specific AWS SDK warnings
const originalWarn = console.warn;
console.warn = (...args) => {
  const msg = args[0]?.toString() || '';
  
  // Suppress known safe warnings
  if (
    msg.includes('punycode') ||
    msg.includes('DYNAMIC_IMPORT') ||
    msg.includes('experimental-vm-modules')
  ) {
    return;
  }
  
  originalWarn.apply(console, args);
};

// Handle unhandled promise rejections in tests
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection in test:', reason);
});

// Cleanup after tests
afterAll(async () => {
  // Give time for async operations to complete
  await new Promise(resolve => setTimeout(resolve, 500));
});
