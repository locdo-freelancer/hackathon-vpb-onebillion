// Signup Page - Dependency Inversion: Depends on abstractions
"use client";

import React from "react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { OAuthButtons } from "@/components/auth/OAuthButtons";
import { SignupForm } from "@/components/auth/SignupForm";
import { useSignup } from "@/hooks/useSigup";

export default function SignupPage() {
  const { handleSignupSuccess, handleToggleLogin, handleQuickDemo } =
    useSignup();

  return (
    <AuthLayout>
      <AuthHeader />

      <div className="bg-cyber-card border border-cyber-border rounded-2xl p-8 shadow-2xl backdrop-blur-xl">
        <OAuthButtons />

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-cyber-border" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-cyber-card text-gray-500">
              Or continue with email
            </span>
          </div>
        </div>

        <SignupForm
          onSuccess={handleSignupSuccess}
          onToggleLogin={handleToggleLogin}
        />
      </div>

      <div className="mt-6 text-center space-y-3">
        <p className="text-xs text-gray-500">
          Bank-grade security • 256-bit encryption
          <i className="fas fa-shield-check text-cyber-accent ml-1" />
        </p>

        {/* Quick Demo Button */}
        <button
          onClick={handleQuickDemo}
          className="text-sm text-cyber-purple hover:text-purple-400 transition-colors font-medium"
        >
          <i className="fas fa-rocket mr-2" />
          Quick Demo → Skip to Onboarding
        </button>
      </div>
    </AuthLayout>
  );
}
