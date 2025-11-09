"use client";

import { useRouter } from "next/navigation";

export interface Signup {
  handleSignupSuccess: () => void;
  handleToggleLogin: () => void;
  handleQuickDemo: () => void;
}

export const useSignup = (): Signup => {
  const router = useRouter();

  const handleSignupSuccess = () => {
    // Redirect directly to onboarding after successful signup
    router.push("/onboarding");
  };

  const handleToggleLogin = () => {
    router.push("/login");
  };

  const handleQuickDemo = () => {
    console.log("🚀 Quick Demo: Skipping to onboarding...");
    router.push("/onboarding");
  };

  return {
    handleSignupSuccess,
    handleToggleLogin,
    handleQuickDemo,
  };
};
