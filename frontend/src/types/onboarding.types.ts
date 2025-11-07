// Site Configuration types following Single Responsibility Principle

export interface OnboardingStep {
  id: number;
  title: string;
  completed: boolean;
}

export interface SiteConfigData {
  // Step 1: Site Details
  siteName: string;
  ipAddress: string;
  port: string;
  domainName: string;

  // Step 2: Server Type
  serverType: "linux" | "windows" | "docker" | "";

  // Step 3: Agent Installation
  installToken: string;

  // Step 4: Validation Status
  networkConnectivity: "pending" | "validating" | "success" | "failed";
  agentAuthentication: "pending" | "validating" | "success" | "failed";
  initialDataSync: "pending" | "validating" | "success" | "failed";
}

export interface OnboardingValidation {
  isValid: boolean;
  errors: Record<string, string>;
}

export enum OnboardingSteps {
  SITE_DETAILS = 1,
  SERVER_TYPE = 2,
  INSTALL_AGENT = 3,
  VALIDATION = 4,
}

export interface ServerTypeOption {
  id: string;
  name: string;
  description: string;
  icon: string;
}

// Keep old interface name for backward compatibility
export type AccountSetupData = SiteConfigData;
