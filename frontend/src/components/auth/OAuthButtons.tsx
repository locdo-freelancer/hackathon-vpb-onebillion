// OAuth Buttons Component - Single Responsibility: Social login buttons
import React from "react";
import { AuthProvider } from "@/types/auth.types";
import { AuthService } from "@/lib/services/auth.service";

export const OAuthButtons: React.FC = () => {
  const handleOAuthLogin = async (provider: AuthProvider) => {
    await AuthService.oauthLogin(provider);
  };

  return (
    <div className="space-y-4 mb-6">
      <button
        onClick={() => handleOAuthLogin(AuthProvider.GOOGLE)}
        className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-900 font-medium py-3 px-4 rounded-lg transition-all duration-200"
      >
        <i className="fab fa-google text-lg" />
        <span>Continue with Google</span>
      </button>

      <button
        onClick={() => handleOAuthLogin(AuthProvider.GITHUB)}
        className="w-full flex items-center justify-center gap-3 bg-[#24292e] hover:bg-[#2f363d] text-white font-medium py-3 px-4 rounded-lg transition-all duration-200"
      >
        <i className="fab fa-github text-lg" />
        <span>Continue with GitHub</span>
      </button>

      <button
        onClick={() => handleOAuthLogin(AuthProvider.MICROSOFT)}
        className="w-full flex items-center justify-center gap-3 bg-[#0078d4] hover:bg-[#106ebe] text-white font-medium py-3 px-4 rounded-lg transition-all duration-200"
      >
        <i className="fab fa-microsoft text-lg" />
        <span>Continue with Microsoft</span>
      </button>
    </div>
  );
};
