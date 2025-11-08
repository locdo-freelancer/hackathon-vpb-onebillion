/**
 * Authentication Validation Configuration
 * Single Responsibility: Manages validation rules and error messages
 */

export interface ValidationRule {
  pattern?: RegExp;
  minLength?: number;
  maxLength?: number;
  message: string;
}

export interface FieldValidation {
  required: ValidationRule;
  format?: ValidationRule;
  length?: ValidationRule;
}

/**
 * Email validation configuration
 */
export const emailValidation: FieldValidation = {
  required: {
    message: "Email is required",
  },
  format: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Please enter a valid email address",
  },
};

/**
 * Password validation configuration
 */
export const passwordValidation: FieldValidation = {
  required: {
    message: "Password is required",
  },
  length: {
    minLength: 8,
    maxLength: 128,
    message: "Password must be between 8 and 128 characters",
  },
  format: {
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    message: "Password must contain uppercase, lowercase, number, and special character",
  },
};

/**
 * MFA code validation configuration
 */
export const mfaCodeValidation: FieldValidation = {
  required: {
    message: "Verification code is required",
  },
  length: {
    minLength: 6,
    maxLength: 6,
    message: "Code must be exactly 6 digits",
  },
  format: {
    pattern: /^\d{6}$/,
    message: "Code must contain only numbers",
  },
};

/**
 * Validate email
 */
export const validateEmail = (email: string): string | null => {
  if (!email) return emailValidation.required.message;
  if (emailValidation.format?.pattern && !emailValidation.format.pattern.test(email)) {
    return emailValidation.format.message;
  }
  return null;
};

/**
 * Validate password
 */
export const validatePassword = (password: string): string | null => {
  if (!password) return passwordValidation.required.message;
  if (passwordValidation.length) {
    const { minLength, maxLength } = passwordValidation.length;
    if (minLength && password.length < minLength) return passwordValidation.length.message;
    if (maxLength && password.length > maxLength) return passwordValidation.length.message;
  }
  return null;
};

/**
 * Validate password strength (for signup)
 */
export const validatePasswordStrength = (password: string): string | null => {
  const basicError = validatePassword(password);
  if (basicError) return basicError;
  
  if (passwordValidation.format?.pattern && !passwordValidation.format.pattern.test(password)) {
    return passwordValidation.format.message;
  }
  return null;
};

/**
 * Validate MFA code
 */
export const validateMFACode = (code: string): string | null => {
  if (!code) return mfaCodeValidation.required.message;
  if (mfaCodeValidation.length && code.length !== mfaCodeValidation.length.minLength) {
    return mfaCodeValidation.length.message;
  }
  if (mfaCodeValidation.format?.pattern && !mfaCodeValidation.format.pattern.test(code)) {
    return mfaCodeValidation.format.message;
  }
  return null;
};
