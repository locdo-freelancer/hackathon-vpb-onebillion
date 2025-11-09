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

  const completeOnboarding = useCallback(async (): Promise<boolean> => {
    if (currentStep !== 2) return false;

    setIsLoading(true);
    setError("");

    try {
      const response = await OnboardingService.completeOnboarding(formData);
      console.log("Complete onboarding response:", response);

      if (response.success) {
        // Extract installToken from response - this is the REAL token from database
        if (response.installToken) {
          console.log("✅ Site created with token:", response.installToken);
          updateFormData({ installToken: response.installToken });
        } else {
          console.warn("⚠️ No installToken in response:", response);
        }

        console.log("Onboarding completed:", response.site);
        setCurrentStep(3);
        return true;
      } else {
        setError(response.message || "Failed to complete onboarding");
        return false;
      }
    } catch (err) {
      console.error("Failed to complete onboarding:", err);
      setError("An error occurred during onboarding completion");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [currentStep, formData, updateFormData]);

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
