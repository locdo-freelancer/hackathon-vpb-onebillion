// Mock Auth Service - For frontend testing without backend
import {
  LoginCredentials,
  SignupCredentials,
  MFAVerification,
  AuthResponse,
} from "@/types/auth.types";

// Simulated delay to mimic API calls
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock user database (in-memory)
const mockUsers: Array<{ email: string; password: string; verified: boolean }> =
  [{ email: "demo@onebillion.vn", password: "Demo123!@#", verified: true }];

export class MockAuthService {
  /**
   * Mock login
   */
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    await delay(1000); // Simulate network delay

    const user = mockUsers.find((u) => u.email === credentials.email);

    if (!user) {
      return {
        success: false,
        message: "Email not found",
      };
    }

    if (user.password !== credentials.password) {
      return {
        success: false,
        message: "Invalid password",
      };
    }

    if (!user.verified) {
      return {
        success: false,
        message: "Please verify your email first",
      };
    }

    // Mock successful login
    return {
      success: true,
      message: "Login successful",
      token: "mock-jwt-token-" + Date.now(),
      user: {
        id: "1",
        email: user.email,
        name: "Demo User",
      },
      requiresMFA: false, // Set to true to test MFA flow
    };
  }

  /**
   * Mock signup
   */
  static async signup(credentials: SignupCredentials): Promise<AuthResponse> {
    await delay(1500);

    // Check if user already exists
    const existingUser = mockUsers.find((u) => u.email === credentials.email);
    if (existingUser) {
      return {
        success: false,
        message: "Email already registered",
      };
    }

    // Add new user (unverified)
    mockUsers.push({
      email: credentials.email,
      password: credentials.password,
      verified: false,
    });

    return {
      success: true,
      message: "Account created! Please verify your email.",
      user: {
        id: String(mockUsers.length),
        email: credentials.email,
        name: "New User",
      },
    };
  }

  /**
   * Mock MFA verification
   */
  static async verifyMFA(verification: MFAVerification): Promise<AuthResponse> {
    await delay(800);

    // Mock: Accept code "123456"
    if (verification.code === "123456") {
      return {
        success: true,
        message: "MFA verification successful",
        token: "mock-jwt-token-mfa-" + Date.now(),
      };
    }

    return {
      success: false,
      message: "Invalid verification code. Try: 123456",
    };
  }

  /**
   * Mock OAuth login
   */
  static async oauthLogin(provider: string): Promise<AuthResponse> {
    await delay(1000);

    return {
      success: true,
      message: `Logged in with ${provider}`,
      token: "mock-oauth-token-" + Date.now(),
      user: {
        id: "999",
        email: `user@${provider}.com`,
        name: `${provider} User`,
      },
    };
  }

  /**
   * Mock resend verification email
   */
  static async resendVerificationEmail(email: string): Promise<AuthResponse> {
    await delay(1000);

    const user = mockUsers.find((u) => u.email === email);
    if (!user) {
      return {
        success: false,
        message: "Email not found",
      };
    }

    console.log(`📧 Mock: Verification email sent to ${email}`);

    return {
      success: true,
      message: "Verification email sent! Check your inbox.",
    };
  }

  /**
   * Mock email verification (call this manually to verify email)
   */
  static async verifyEmail(email: string): Promise<AuthResponse> {
    await delay(500);

    const user = mockUsers.find((u) => u.email === email);
    if (!user) {
      return {
        success: false,
        message: "Email not found",
      };
    }

    user.verified = true;

    return {
      success: true,
      message: "Email verified successfully!",
    };
  }

  /**
   * Mock password reset request
   */
  static async requestPasswordReset(email: string): Promise<AuthResponse> {
    await delay(1000);

    const user = mockUsers.find((u) => u.email === email);
    if (!user) {
      return {
        success: false,
        message: "Email not found",
      };
    }

    console.log(`📧 Mock: Password reset email sent to ${email}`);

    return {
      success: true,
      message: "Password reset email sent!",
    };
  }
}
