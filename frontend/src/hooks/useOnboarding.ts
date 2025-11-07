// Custom hook for onboarding - Interface Segregation
import { useState, useCallback } from "react";
import { SiteConfigData, OnboardingSteps } from "@/types/onboarding.types";
import { OnboardingService } from "@/lib/services/onboarding.service";

const INITIAL_DATA: SiteConfigData = {
  siteName: "",
  ipAddress: "",
  port: "",
  domainName: "",
  serverType: "",
  installToken: "sv_abc123def456",
  networkConnectivity: "pending",
  agentAuthentication: "pending",
  initialDataSync: "pending",
};

export const useOnboarding = () => {
  const [currentStep, setCurrentStep] = useState<number>(
    OnboardingSteps.SITE_DETAILS
  );
  const [formData, setFormData] = useState<SiteConfigData>(INITIAL_DATA);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const updateFormData = useCallback((updates: Partial<SiteConfigData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  }, []);

  const nextStep = useCallback(async () => {
    setError("");
    setIsLoading(true);

    try {
      // Auto-save progress
      await OnboardingService.saveProgress(formData, currentStep);

      if (currentStep < 4) {
        setCurrentStep((prev) => prev + 1);
      }
    } catch (err) {
      setError("Failed to save progress");
    } finally {
      setIsLoading(false);
    }
  }, [currentStep, formData]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  const completeOnboarding = useCallback(async () => {
    setError("");
    setIsLoading(true);

    try {
      const response = await OnboardingService.completeOnboarding(formData);

      if (response.success) {
        return true;
      } else {
        setError(response.message || "Failed to complete setup");
        return false;
      }
    } catch (err) {
      setError("An unexpected error occurred");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [formData]);

  return {
    currentStep,
    formData,
    isLoading,
    error,
    updateFormData,
    nextStep,
    prevStep,
    completeOnboarding,
    setError,
  };
};
