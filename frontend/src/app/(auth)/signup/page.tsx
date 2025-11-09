// Signup Page - Dependency Inversion: Depends on abstractions
"use client";

import React from "react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { SignupForm } from "@/components/auth/SignupForm";
import { useSignup } from "@/hooks/useSigup";

export default function SignupPage() {
  const { handleSignupSuccess, handleToggleLogin } = useSignup();

  return (
    <AuthLayout>
      <AuthHeader />

      <div className="bg-cyber-card border border-cyber-border rounded-2xl p-8 shadow-2xl backdrop-blur-xl">
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
      </div>
    </AuthLayout>
  );
}
