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
  serverType: "windows" | "";

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

// API Response Types - Backend always wraps in { success, data, timestamp }

/**
 * Standard API wrapper from backend ResponseLoggingInterceptor
 */
export interface OnboardingApiResponse<T = any> {
  success: boolean;
  data: T;
  timestamp: string;
}

/**
 * Validate Connectivity Response
 * POST /api/onboarding/validate-connectivity
 */
export interface ValidateConnectivityResponseData {
  success: boolean;
  networkConnectivity: boolean;
  agentAuthentication: boolean;
  initialDataSync: boolean;
  message?: string;
}

/**
 * Complete Onboarding Response
 * POST /api/onboarding/complete
 */
export interface CompleteOnboardingResponseData {
  success: boolean;
  site: {
    id: string;
    name: string;
    ipAddress: string;
    port: number;
    domain?: string;
  };
  agent: {
    id: string;
    installToken: string;
    status: string;
  };
  message: string;
}

/**
 * Save Progress Response
 * POST /api/onboarding/progress
 */
export interface SaveProgressResponseData {
  success: boolean;
  message?: string;
}

/**
 * Validate IP Response
 * POST /api/onboarding/validate-ip
 */
export interface ValidateIpResponseData {
  success: boolean;
  isValid: boolean;
  message?: string;
}

// Keep old interface name for backward compatibility
export type AccountSetupData = SiteConfigData;
