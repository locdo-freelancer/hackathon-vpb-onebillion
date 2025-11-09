// Authentication Service - Single Responsibility: Handle auth logic
import {
  LoginCredentials,
  SignupCredentials,
  AuthResponse,
  ApiResponse,
  LoginResponseData,
  RegisterResponseData,
  ProfileResponseData,
} from "@/types/auth.types";
import { apiClient } from "../api-client";

export class AuthService {
  /**
   * Login user - POST /api/auth/login
   */
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response: ApiResponse<LoginResponseData> = await apiClient.post(
        "/auth/login",
        {
          email: credentials.email,
          password: credentials.password,
        }
      );

      // API returns: { success: true, data: { access_token, user } }
      if (response.success && response.data?.access_token) {
        localStorage.setItem("token", response.data.access_token);
        return {
          success: true,
          token: response.data.access_token,
          user: {
            id: response.data.user.id,
            email: response.data.user.email,
            name: response.data.user.full_name,
          },
        };
      }

      return {
        success: false,
        message: "Login failed. Invalid response.",
      };
    } catch (error) {
      console.error("Login error:", error);
      const message =
        error instanceof Error
          ? error.message
          : "Login failed. Please try again.";
      return {
        success: false,
        message,
      };
    }
  }

  /**
   * Register new user - POST /api/auth/register
   */
  static async register(credentials: SignupCredentials): Promise<AuthResponse> {
    try {
      const response: ApiResponse<RegisterResponseData> = await apiClient.post(
        "/auth/register",
        {
          email: credentials.email,
          password: credentials.password,
          full_name: credentials.fullName || credentials.email.split("@")[0],
          company_name: credentials.companyName || "",
        }
      );

      // API returns: { success: true, data: { message, user } }
      if (response.success && response.data?.user) {
        return {
          success: true,
          message: response.data.message || "Registration successful",
          user: {
            id: response.data.user.id,
            email: response.data.user.email,
            name: response.data.user.full_name,
          },
        };
      }

      return {
        success: false,
        message: "Registration failed. Invalid response.",
      };
    } catch (error) {
      console.error("Register error:", error);
      const message =
        error instanceof Error
          ? error.message
          : "Registration failed. Please try again.";
      return {
        success: false,
        message,
      };
    }
  }

  /**
   * Get user profile - GET /api/auth/profile
   */
  static async getProfile(): Promise<AuthResponse> {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return {
          success: false,
          message: "Not authenticated",
        };
      }

      const response: ApiResponse<ProfileResponseData> = await apiClient.get(
        "/auth/profile"
      );

      // API returns: { success: true, data: { id, email, ... } }
      if (response.success && response.data?.id) {
        return {
          success: true,
          user: {
            id: response.data.id,
            email: response.data.email,
            name: response.data.full_name,
          },
        };
      }

      return {
        success: false,
        message: "Failed to get profile",
      };
    } catch (error) {
      console.error("Get profile error:", error);
      const message =
        error instanceof Error ? error.message : "Failed to get profile";
      return {
        success: false,
        message,
      };
    }
  }

  /**
   * Logout user
   */
  static logout(): void {
    localStorage.removeItem("token");
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    return !!localStorage.getItem("token");
  }

  /**
   * Get stored token
   */
  static getToken(): string | null {
    return localStorage.getItem("token");
  }
}
