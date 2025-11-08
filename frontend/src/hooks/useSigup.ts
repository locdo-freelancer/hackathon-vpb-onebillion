"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export interface Signup {
  showVerification: boolean;
  email: string;
  handleSignupSuccess: (userEmail: string) => void;
  handleToggleLogin: () => void;
  handleVerificationComplete: () => void;
  handleBack: () => void;
  handleQuickDemo: () => void;
}

export const useSignup = (): Signup => {
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

  const handleVerificationComplete = () => {
    router.push("/onboarding");
  };

  const handleBack = () => {
    setShowVerification(false);
    router.push("/login");
  };

  const handleQuickDemo = () => {
    console.log("🚀 Quick Demo: Skipping to onboarding...");
    router.push("/onboarding");
  };

  return {
    showVerification,
    email,
    handleSignupSuccess,
    handleToggleLogin,
    handleVerificationComplete,
    handleBack,
    handleQuickDemo,
  };
};
