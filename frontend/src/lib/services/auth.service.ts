// Authentication Service - Single Responsibility: Handle authentication logic
import {
  LoginCredentials,
  SignupCredentials,
  MFAVerification,
  AuthResponse,
  AuthProvider,
} from "@/types/auth.types";
import { apiClient } from "../api-client";

export class AuthService {
  /**
   * Login with email and password
   */
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post("/auth/login", credentials);
      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: "Login failed. Please check your credentials.",
      };
    }
  }

  /**
   * Signup with email and password
   */
  static async signup(credentials: SignupCredentials): Promise<AuthResponse> {
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
    try {
      const response = await apiClient.post("/auth/mfa/verify", verification);
      return response.data;
    } catch (error) {
      console.error("MFA verification error:", error);
      return {
        success: false,
        message: "Invalid verification code.",
      };
    }
  }

  /**
   * OAuth login
   */
  static async oauthLogin(provider: AuthProvider): Promise<void> {
    // Redirect to OAuth provider
    window.location.href = `/api/auth/oauth/${provider}`;
  }

  /**
   * Request password reset
   */
  static async requestPasswordReset(email: string): Promise<AuthResponse> {
    try {
      const response = await apiClient.post("/auth/password/reset-request", {
        email,
      });
      return response.data;
    } catch (error) {
      console.error("Password reset request error:", error);
      return {
        success: false,
        message: "Failed to send reset email.",
      };
    }
  }

  /**
   * Resend verification email
   */
  static async resendVerificationEmail(email: string): Promise<AuthResponse> {
    try {
      const response = await apiClient.post("/auth/email/resend", { email });
      return response.data;
    } catch (error) {
      console.error("Resend verification error:", error);
      return {
        success: false,
        message: "Failed to resend verification email.",
      };
    }
  }
}
