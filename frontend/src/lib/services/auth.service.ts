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
      const response = await apiClient.post("/auth/login", {
        email: credentials.email,
        password: credentials.password,
      });

      // Backend returns: { success: true, data: { access_token, user } }
      if (response.data?.access_token) {
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
        message: "Login failed. Invalid response from server.",
      };
    } catch (error) {
      console.error("Login error:", error);

      // Extract error message from API error
      let message = "Login failed. Please check your credentials.";
      if (error instanceof Error) {
        // If API returned error message, use it
        if (error.message.includes("Unauthorized")) {
          message = "Invalid email or password. Please try again.";
        } else if (error.message.includes("API Error")) {
          message = "Server error. Please try again later.";
        } else {
          message = error.message;
        }
      }

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
      const response = await apiClient.post("/auth/register", {
        email: credentials.email,
        password: credentials.password,
        full_name: credentials.fullName || credentials.email.split("@")[0],
        company_name: credentials.companyName || "",
      });

      // Backend returns: { success: true, data: { message, user } }
      if (response.data?.user) {
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
        message: "Registration failed. Invalid response from server.",
      };
    } catch (error) {
      console.error("Register error:", error);

      // Extract error message from API error
      let message = "Registration failed. Please try again.";
      if (error instanceof Error) {
        if (
          error.message.includes("Conflict") ||
          error.message.includes("409")
        ) {
          message = "Email already registered. Please use a different email.";
        } else if (error.message.includes("API Error")) {
          message = "Server error. Please try again later.";
        } else {
          message = error.message;
        }
      }

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

      const response = await apiClient.get("/auth/profile");

      // Backend returns: { id, email, full_name, ... }
      if (response.id) {
        return {
          success: true,
          user: {
            id: response.id,
            email: response.email,
            name: response.full_name,
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
