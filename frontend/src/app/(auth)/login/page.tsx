"use client";

import React from "react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { LoginForm } from "@/components/auth/LoginForm";
import { MFAModal } from "@/components/auth/MFAModal";
import { useLogin } from "@/hooks/useLogin";

export default function LoginPage() {
  const {
    showMFAModal,
    setShowMFAModal,
    handleLoginSuccess,
    handleMFAVerify,
    handleToggleSignup,
  } = useLogin();

  return (
    <AuthLayout>
      <AuthHeader />

      <div className="bg-cyber-card border border-cyber-border rounded-2xl p-8 shadow-2xl backdrop-blur-xl">
        <LoginForm
          onSuccess={handleLoginSuccess}
          onToggleSignup={handleToggleSignup}
        />
      </div>

      <div className="mt-6 text-center space-y-3">
        <p className="text-xs text-gray-500">
          Bank-grade security • 256-bit encryption
          <i className="fas fa-shield-check text-cyber-accent ml-1" />
        </p>
      </div>

      <MFAModal
        isOpen={showMFAModal}
        onClose={() => setShowMFAModal(false)}
        onVerify={handleMFAVerify}
      />
    </AuthLayout>
  );
}
