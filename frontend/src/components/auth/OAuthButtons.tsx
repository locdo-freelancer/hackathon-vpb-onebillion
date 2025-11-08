/**
 * OAuth Buttons Component
 * Single Responsibility: Social login buttons
 * Open/Closed: Uses auth-oauth.config for provider configuration
 * Dependency Inversion: Depends on config abstraction
 */
import React from "react";
import { AuthProvider } from "@/types/auth.types";
import { AuthService } from "@/lib/services/auth.service";
import {
  getOAuthProviders,
  getProviderButtonClasses,
} from "@/config/auth-oauth.config";

export const OAuthButtons: React.FC = () => {
  const providers = getOAuthProviders();

  const handleOAuthLogin = async (provider: AuthProvider) => {
    await AuthService.oauthLogin(provider);
  };

  return (
    <div className="space-y-4 mb-6">
      {providers.map((config) => (
        <button
          key={config.id}
          onClick={() => handleOAuthLogin(config.id)}
          className={getProviderButtonClasses(config.id)}
        >
          <i className={`${config.icon} text-lg`} />
          <span>Continue with {config.name}</span>
        </button>
      ))}
    </div>
  );
};
