// Login Page - Dependency Inversion: Depends on abstractions
"use client";

import React, { useState } from "react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { OAuthButtons } from "@/components/auth/OAuthButtons";
import { LoginForm } from "@/components/auth/LoginForm";
import { MFAModal } from "@/components/auth/MFAModal";
import { AuthService } from "@/lib/services/auth.service";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [showMFAModal, setShowMFAModal] = useState(false);
  const [userId, setUserId] = useState<string>();

  const handleLoginSuccess = (requiresMFA: boolean, userId?: string) => {
    if (requiresMFA && userId) {
      setUserId(userId);
      setShowMFAModal(true);
    } else {
      // Redirect to dashboard
      router.push("/dashboard");
    }
  };

  const handleMFAVerify = async (code: string) => {
    if (!userId) return;

    const response = await AuthService.verifyMFA({ code, userId });

    if (response.success) {
      setShowMFAModal(false);
      router.push("/dashboard");
    } else {
      alert(response.message || "Invalid code");
    }
  };

  const handleToggleSignup = () => {
    router.push("/signup");
  };

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

        <LoginForm
          onSuccess={handleLoginSuccess}
          onToggleSignup={handleToggleSignup}
        />
      </div>

      <div className="mt-6 text-center">
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
