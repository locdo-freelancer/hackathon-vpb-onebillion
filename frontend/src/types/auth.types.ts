// Authentication types following Single Responsibility Principle

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupCredentials extends LoginCredentials {
  confirmPassword: string;
}

export interface MFAVerification {
  code: string;
  userId: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  requiresMFA?: boolean;
  userId?: string;
  token?: string;
  user?: User;
}

export enum PasswordStrength {
  WEAK = "weak",
  FAIR = "fair",
  GOOD = "good",
  STRONG = "strong",
}

export interface PasswordValidation {
  strength: PasswordStrength;
  score: number;
  feedback: string;
}

export enum AuthProvider {
  GOOGLE = "google",
  GITHUB = "github",
  MICROSOFT = "microsoft",
}
