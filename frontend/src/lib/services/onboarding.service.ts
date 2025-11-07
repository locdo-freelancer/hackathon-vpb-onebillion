// Onboarding Service - Single Responsibility: Handle onboarding logic
import { SiteConfigData } from "@/types/onboarding.types";
import { apiClient } from "../api-client";
import { MockOnboardingService } from "./onboarding.service.mock";

// Toggle between mock and real API
const USE_MOCK = true; // Set to false when backend is ready

export class OnboardingService {
  /**
   * Save onboarding progress
   */
  static async saveProgress(
    data: Partial<SiteConfigData>,
    step: number
  ): Promise<{ success: boolean }> {
    if (USE_MOCK) {
      return MockOnboardingService.saveProgress(data, step);
    }

    try {
      const response = await apiClient.post("/onboarding/progress", {
        data,
        step,
      });
      return response.data;
    } catch (error) {
      console.error("Save progress error:", error);
      return { success: false };
    }
  }

  /**
   * Complete onboarding
   */
  static async completeOnboarding(
    data: SiteConfigData
  ): Promise<{ success: boolean; message?: string }> {
    if (USE_MOCK) {
      return MockOnboardingService.completeOnboarding(data);
    }

    try {
      const response = await apiClient.post("/onboarding/complete", data);
      return response.data;
    } catch (error) {
      console.error("Complete onboarding error:", error);
      return {
        success: false,
        message: "Failed to complete setup. Please try again.",
      };
    }
  }

  /**
   * Validate IP address
   */
  static async validateIP(
    ipAddress: string
  ): Promise<{ success: boolean; message?: string }> {
    if (USE_MOCK) {
      return MockOnboardingService.validateIP(ipAddress);
    }

    try {
      const response = await apiClient.post("/onboarding/validate-ip", {
        ipAddress,
      });
      return response.data;
    } catch (error) {
      console.error("Validate IP error:", error);
      return {
        success: false,
        message: "Failed to validate IP address.",
      };
    }
  }

  /**
   * Generate install token
   */
  static async generateInstallToken(
    serverType: string
  ): Promise<{ success: boolean; token?: string }> {
    if (USE_MOCK) {
      return MockOnboardingService.generateInstallToken(serverType);
    }

    try {
      const response = await apiClient.post("/onboarding/generate-token", {
        serverType,
      });
      return response.data;
    } catch (error) {
      console.error("Generate token error:", error);
      return {
        success: false,
      };
    }
  }

  /**
   * Validate connectivity
   */
  static async validateConnectivity(): Promise<{
    networkConnectivity: "success" | "failed";
    agentAuthentication: "success" | "failed";
    initialDataSync: "success" | "failed";
  }> {
    if (USE_MOCK) {
      return MockOnboardingService.validateConnectivity();
    }

    try {
      const response = await apiClient.get("/onboarding/validate-connectivity");
      return response.data;
    } catch (error) {
      console.error("Validate connectivity error:", error);
      return {
        networkConnectivity: "failed",
        agentAuthentication: "failed",
        initialDataSync: "failed",
      };
    }
  }
}
