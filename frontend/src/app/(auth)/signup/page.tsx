// Signup Page - Dependency Inversion: Depends on abstractions
"use client";

import React from "react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { SignupForm } from "@/components/auth/SignupForm";
import { useSignup } from "@/hooks/useSigup";
import { LanguageSwitcher } from "@/components/shared";
import { useTranslations } from "@/hooks/useTranslations";

export default function SignupPage() {
  const { handleSignupSuccess, handleToggleLogin } = useSignup();
  const { t } = useTranslations("auth");

  return (
    <AuthLayout>
      <div className="absolute top-6 right-6 z-50">
        <LanguageSwitcher />
      </div>
      
      <AuthHeader />

      <div className="bg-cyber-card border border-cyber-border rounded-2xl p-8 shadow-2xl backdrop-blur-xl">
        <SignupForm
          onSuccess={handleSignupSuccess}
          onToggleLogin={handleToggleLogin}
        />
      </div>

      <div className="mt-6 text-center space-y-3">
        <p className="text-xs text-gray-500">
          {t("bankGradeSecurity")}
          <i className="fas fa-shield-check text-cyber-accent ml-1" />
        </p>
      </div>
    </AuthLayout>
  );
}
