"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthService } from "@/lib/services/auth.service";

export const useLogin = () => {
  const router = useRouter();
  const [showMFAModal, setShowMFAModal] = useState(false);
  const [userId, setUserId] = useState<string>();
  const [error, setError] = useState<string | null>(null);

  const handleLoginSuccess = async (requiresMFA: boolean, userId?: string) => {
    if (requiresMFA && userId) {
      setUserId(userId);
      setShowMFAModal(true);
      return;
    }
    // Redirect to onboarding after successful login
    await router.push("/onboarding");
  };

  const handleMFAVerify = async (code: string) => {
    if (!userId) return;

    try {
      // TODO: Implement verifyMFA in AuthService
      setError("MFA verification not yet implemented");
      // const response = await AuthService.verifyMFA({ code, userId });
      // if (response.success) {
      //   setShowMFAModal(false);
      //   await router.push("/dashboard");
      // } else {
      //   setError(response.message || "Invalid code");
      // }
    } catch {
      setError("Verification failed. Please try again.");
    }
  };

  const handleToggleSignup = async () => {
    await router.push("/signup");
  };

  return {
    showMFAModal,
    setShowMFAModal,
    error,
    handleLoginSuccess,
    handleMFAVerify,
    handleToggleSignup,
  };
};
