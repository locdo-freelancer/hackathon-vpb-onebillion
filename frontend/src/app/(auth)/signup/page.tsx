// Signup Page - Dependency Inversion: Depends on abstractions
"use client";

import React, { useState } from "react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { OAuthButtons } from "@/components/auth/OAuthButtons";
import { SignupForm } from "@/components/auth/SignupForm";
import { EmailVerification } from "@/components/auth/EmailVerification";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [showVerification, setShowVerification] = useState(false);
  const [email, setEmail] = useState("");

  const handleSignupSuccess = (userEmail: string) => {
    setEmail(userEmail);
    setShowVerification(true);
  };

  const handleToggleLogin = () => {
    router.push("/login");
  };

  const handleBack = () => {
    setShowVerification(false);
    router.push("/login");
  };

  return (
    <AuthLayout>
      <AuthHeader />

      {!showVerification ? (
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
      ) : (
        <EmailVerification email={email} onBack={handleBack} />
      )}

      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500">
          Bank-grade security • 256-bit encryption
          <i className="fas fa-shield-check text-cyber-accent ml-1" />
        </p>
      </div>
    </AuthLayout>
  );
}
