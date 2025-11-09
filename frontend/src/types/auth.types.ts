// Authentication types following Single Responsibility Principle

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupCredentials extends LoginCredentials {
  confirmPassword: string;
  fullName?: string;
  companyName?: string;
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

// API Response wrapper types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

export interface LoginResponseData {
  access_token: string;
  user: {
    id: string;
    email: string;
    full_name: string;
    company_name: string;
  };
}

export interface RegisterResponseData {
  message: string;
  user: {
    id: string;
    email: string;
    full_name: string;
    company_name: string;
  };
}

export interface ProfileResponseData {
  id: string;
  email: string;
  full_name: string;
  company_name: string;
  createdAt?: number;
}

export interface ApiErrorResponse {
  message: string;
  statusCode?: number;
  error?: string;
}
