// Authentication Service - Single Responsibility: Handle auth logic
import {
  LoginCredentials,
  SignupCredentials,
  AuthResponse,
} from "@/types/auth.types";
import { apiClient } from "../api-client";

// Toggle between mock and real API
const USE_MOCK = false; // Real API enabled

export class AuthService {
  /**
   * Login user - POST /api/auth/login
   */
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post("/auth/login", {
        email: credentials.email,
        password: credentials.password,
      });

      if (response.access_token) {
        localStorage.setItem("token", response.access_token);
        return {
          success: true,
          token: response.access_token,
          user: response.user,
        };
      }

      return {
        success: false,
        message: "Login failed. Invalid response.",
      };
    } catch (error: any) {
      console.error("Login error:", error);
      return {
        success: false,
        message: error.message || "Login failed. Please try again.",
      };
    }
  }

  /**
   * Register new user - POST /api/auth/register
   */
  static async register(credentials: SignupCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post("/auth/register", {
        email: credentials.email,
        password: credentials.password,
        full_name: credentials.fullName || credentials.email.split("@")[0],
        company_name: credentials.companyName || "",
      });

      if (response.user) {
        return {
          success: true,
          message: response.message || "Registration successful",
          user: response.user,
        };
      }

      return {
        success: false,
        message: "Registration failed. Invalid response.",
      };
    } catch (error: any) {
      console.error("Register error:", error);
      return {
        success: false,
        message: error.message || "Registration failed. Please try again.",
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

      const response = await apiClient.get("/auth/profile");

      if (response.id) {
        return {
          success: true,
          user: response,
        };
      }

      return {
        success: false,
        message: "Failed to get profile",
      };
    } catch (error: any) {
      console.error("Get profile error:", error);
      return {
        success: false,
        message: error.message || "Failed to get profile",
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
