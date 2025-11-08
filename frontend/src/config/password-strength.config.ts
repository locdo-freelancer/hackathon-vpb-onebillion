/**
 * Password Strength Configuration
 * Single Responsibility: Manages password strength evaluation and display
 */

import { PasswordStrength } from "@/types/auth.types";

export interface PasswordStrengthConfig {
  level: PasswordStrength;
  label: string;
  color: string;
  bgColor: string;
  textColor: string;
  minScore: number;
  maxScore: number;
}

export const passwordStrengthLevels: Record<PasswordStrength, PasswordStrengthConfig> = {
  [PasswordStrength.WEAK]: {
    level: PasswordStrength.WEAK,
    label: "Weak",
    color: "red",
    bgColor: "bg-red-500",
    textColor: "text-red-400",
    minScore: 0,
    maxScore: 2,
  },
  [PasswordStrength.FAIR]: {
    level: PasswordStrength.FAIR,
    label: "Fair",
    color: "orange",
    bgColor: "bg-orange-500",
    textColor: "text-orange-400",
    minScore: 3,
    maxScore: 4,
  },
  [PasswordStrength.GOOD]: {
    level: PasswordStrength.GOOD,
    label: "Good",
    color: "yellow",
    bgColor: "bg-yellow-500",
    textColor: "text-yellow-400",
    minScore: 5,
    maxScore: 6,
  },
  [PasswordStrength.STRONG]: {
    level: PasswordStrength.STRONG,
    label: "Strong",
    color: "green",
    bgColor: "bg-green-500",
    textColor: "text-green-400",
    minScore: 7,
    maxScore: 10,
  },
};

/**
 * Calculate password strength score
 */
export const calculatePasswordScore = (password: string): number => {
  let score = 0;

  if (!password) return score;

  // Length
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (password.length >= 16) score++;

  // Character variety
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[@$!%*?&]/.test(password)) score++;

  // Patterns
  if (/(.)\1{2,}/.test(password)) score--; // Repeated characters
  if (/^[a-zA-Z]+$/.test(password)) score--; // Only letters
  if (/^\d+$/.test(password)) score--; // Only numbers

  return Math.max(0, Math.min(10, score));
};

/**
 * Get password strength level from score
 */
export const getPasswordStrength = (score: number): PasswordStrength => {
  for (const config of Object.values(passwordStrengthLevels)) {
    if (score >= config.minScore && score <= config.maxScore) {
      return config.level;
    }
  }
  return PasswordStrength.WEAK;
};

/**
 * Get password strength configuration
 */
export const getPasswordStrengthConfig = (
  strength: PasswordStrength
): PasswordStrengthConfig => {
  return passwordStrengthLevels[strength];
};

/**
 * Get strength color
 */
export const getStrengthColor = (strength: PasswordStrength): string => {
  return passwordStrengthLevels[strength].bgColor;
};

/**
 * Get strength text color
 */
export const getStrengthTextColor = (strength: PasswordStrength): string => {
  return passwordStrengthLevels[strength].textColor;
};

/**
 * Get password feedback
 */
export const getPasswordFeedback = (password: string, score: number): string => {
  if (!password) return "Enter a password";
  if (score <= 2) return "Use uppercase, lowercase, numbers, and symbols";
  if (score <= 4) return "Add more character variety";
  if (score <= 6) return "Good! Consider making it longer";
  return "Excellent password strength!";
};

/**
 * Calculate strength percentage for progress bar
 */
export const getStrengthPercentage = (score: number): number => {
  return Math.min(100, (score / 10) * 100);
};
