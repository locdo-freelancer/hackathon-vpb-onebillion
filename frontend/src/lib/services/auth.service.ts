// Authentication Service - Single Responsibility: Handle auth logic
import {
  LoginCredentials,
  SignupCredentials,
  MFAVerification,
  AuthResponse,
  AuthProvider,
} from "@/types/auth.types";
import { apiClient } from "../api-client";
import { MockAuthService } from "./auth.service.mock";

// Toggle between mock and real API
const USE_MOCK = true; // Set to false when backend is ready

export class AuthService {
  /**
   * Login user
   */
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    if (USE_MOCK) {
      return MockAuthService.login(credentials);
    }

    try {
      const response = await apiClient.post("/auth/login", credentials);
      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: "Login failed. Please try again.",
      };
    }
  }

  /**
   * Signup new user
   */
  static async signup(credentials: SignupCredentials): Promise<AuthResponse> {
    if (USE_MOCK) {
      return MockAuthService.signup(credentials);
    }

    try {
      const response = await apiClient.post("/auth/signup", credentials);
      return response.data;
    } catch (error) {
      console.error("Signup error:", error);
      return {
        success: false,
        message: "Signup failed. Please try again.",
      };
    }
  }

  /**
   * Verify MFA code
   */
  static async verifyMFA(verification: MFAVerification): Promise<AuthResponse> {
    if (USE_MOCK) {
      return MockAuthService.verifyMFA(verification);
    }

    try {
      const response = await apiClient.post("/auth/mfa/verify", verification);
      return response.data;
    } catch (error) {
      console.error("MFA verification error:", error);
      return {
        success: false,
        message: "Verification failed. Please try again.",
      };
    }
  }

  /**
   * OAuth login
   */
  static async oauthLogin(provider: AuthProvider): Promise<AuthResponse> {
    if (USE_MOCK) {
      return MockAuthService.oauthLogin(provider);
    }

    try {
      const response = await apiClient.post("/auth/oauth", { provider });
      return response.data;
    } catch (error) {
      console.error("OAuth login error:", error);
      return {
        success: false,
        message: `${provider} login failed. Please try again.`,
      };
    }
  }

  /**
   * Request password reset
   */
  static async requestPasswordReset(email: string): Promise<AuthResponse> {
    if (USE_MOCK) {
      return MockAuthService.requestPasswordReset(email);
    }

    try {
      const response = await apiClient.post("/auth/password/reset", { email });
      return response.data;
    } catch (error) {
      console.error("Password reset error:", error);
      return {
        success: false,
        message: "Failed to send reset email. Please try again.",
      };
    }
  }

  /**
   * Resend verification email
   */
  static async resendVerificationEmail(email: string): Promise<AuthResponse> {
    if (USE_MOCK) {
      return MockAuthService.resendVerificationEmail(email);
    }

    try {
      const response = await apiClient.post("/auth/email/resend", { email });
      return response.data;
    } catch (error) {
      console.error("Resend email error:", error);
      return {
        success: false,
        message: "Failed to resend email. Please try again.",
      };
    }
  }
}
