export interface ValidationStatus {
  networkConnectivity: 'pending' | 'validating' | 'success' | 'failed';
  agentAuthentication: 'pending' | 'validating' | 'success' | 'failed';
  initialDataSync: 'pending' | 'validating' | 'success' | 'failed';
}

export interface OnboardingCompletionResponse {
  success: boolean;
  message: string;
  siteId?: string;
  agentId?: string;
}
