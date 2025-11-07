// Mock Onboarding Service - For frontend testing without backend
import { SiteConfigData } from "@/types/onboarding.types";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock storage for onboarding data
let mockOnboardingData: Partial<SiteConfigData> | null = null;

export class MockOnboardingService {
  /**
   * Mock save onboarding progress
   */
  static async saveProgress(
    data: Partial<SiteConfigData>,
    step: number
  ): Promise<{ success: boolean }> {
    await delay(500);

    mockOnboardingData = { ...mockOnboardingData, ...data };
    console.log(`✅ Mock: Progress saved for step ${step}`, data);

    return { success: true };
  }

  /**
   * Mock complete onboarding
   */
  static async completeOnboarding(
    data: SiteConfigData
  ): Promise<{ success: boolean; message?: string }> {
    await delay(1000);

    mockOnboardingData = data;
    console.log("🎉 Mock: Site configuration completed!", data);

    return {
      success: true,
      message: "Server monitoring setup completed successfully!",
    };
  }

  /**
   * Mock validate IP address
   */
  static async validateIP(
    ipAddress: string
  ): Promise<{ success: boolean; message?: string }> {
    await delay(800);

    const ipPattern =
      /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

    if (ipPattern.test(ipAddress)) {
      console.log(`✅ Mock: IP address ${ipAddress} is valid`);
      return {
        success: true,
        message: "IP address validated successfully",
      };
    }

    return {
      success: false,
      message: "Invalid IP address format",
    };
  }

  /**
   * Mock generate install token
   */
  static async generateInstallToken(
    serverType: string
  ): Promise<{ success: boolean; token?: string }> {
    await delay(500);

    const token = `sv_${Math.random().toString(36).substring(2, 15)}`;
    console.log(`🔑 Mock: Generated install token for ${serverType}: ${token}`);

    return {
      success: true,
      token,
    };
  }

  /**
   * Mock validate connectivity
   */
  static async validateConnectivity(): Promise<{
    networkConnectivity: "success" | "failed";
    agentAuthentication: "success" | "failed";
    initialDataSync: "success" | "failed";
  }> {
    await delay(2000);

    console.log("✅ Mock: All connectivity checks passed!");

    return {
      networkConnectivity: "success",
      agentAuthentication: "success",
      initialDataSync: "success",
    };
  }

  /**
   * Mock get saved progress
   */
  static async getProgress(): Promise<Partial<SiteConfigData> | null> {
    await delay(300);
    return mockOnboardingData;
  }
}
