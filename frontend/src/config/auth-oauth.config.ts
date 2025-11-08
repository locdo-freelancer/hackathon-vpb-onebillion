/**
 * OAuth Providers Configuration
 * Single Responsibility: Manages OAuth provider settings and display properties
 */

import { AuthProvider } from "@/types/auth.types";

export interface OAuthProviderConfig {
  id: AuthProvider;
  name: string;
  icon: string;
  bgColor: string;
  hoverColor: string;
  textColor: string;
  order: number;
}

export const oauthProviders: Record<AuthProvider, OAuthProviderConfig> = {
  [AuthProvider.GOOGLE]: {
    id: AuthProvider.GOOGLE,
    name: "Google",
    icon: "fab fa-google",
    bgColor: "bg-white",
    hoverColor: "hover:bg-gray-100",
    textColor: "text-gray-900",
    order: 1,
  },
  [AuthProvider.GITHUB]: {
    id: AuthProvider.GITHUB,
    name: "GitHub",
    icon: "fab fa-github",
    bgColor: "bg-[#24292e]",
    hoverColor: "hover:bg-[#2f363d]",
    textColor: "text-white",
    order: 2,
  },
  [AuthProvider.MICROSOFT]: {
    id: AuthProvider.MICROSOFT,
    name: "Microsoft",
    icon: "fab fa-microsoft",
    bgColor: "bg-[#0078d4]",
    hoverColor: "hover:bg-[#106ebe]",
    textColor: "text-white",
    order: 3,
  },
};

/**
 * Get OAuth providers in display order
 */
export const getOAuthProviders = (): OAuthProviderConfig[] => {
  return Object.values(oauthProviders).sort((a, b) => a.order - b.order);
};

/**
 * Get provider configuration
 */
export const getProviderConfig = (provider: AuthProvider): OAuthProviderConfig => {
  return oauthProviders[provider];
};

/**
 * Get provider button classes (returns complete class string with base styles)
 */
export const getProviderButtonClasses = (provider: AuthProvider): string => {
  const config = getProviderConfig(provider);
  const baseClasses = "w-full flex items-center justify-center gap-3 font-medium py-3 px-4 rounded-lg transition-all duration-200";
  return `${baseClasses} ${config.bgColor} ${config.hoverColor} ${config.textColor}`;
};
