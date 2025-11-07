// Onboarding Page - Dependency Inversion: Depends on abstractions
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { OnboardingLayout } from "@/components/onboarding/OnboardingLayout";
import { ProgressIndicator } from "@/components/onboarding/ProgressIndicator";
import { Step1PersonalInfo } from "@/components/onboarding/Step1PersonalInfo";
import { Step2AccountType } from "@/components/onboarding/Step2AccountType";
import { Step3Verification } from "@/components/onboarding/Step3Verification";
import { Step4Security } from "@/components/onboarding/Step4Security";
import { HelpPanel } from "@/components/onboarding/HelpPanel";
import { useOnboarding } from "@/hooks/useOnboarding";
import { useOnboardingStore } from "@/stores/onboardingStore";

const STEP_TITLES = [
  "Site Details",
  "Server Type",
  "Install Agent",
  "Validation",
];

export default function OnboardingPage() {
  const router = useRouter();
  const { markStepComplete, completeOnboarding: markOnboardingComplete } =
    useOnboardingStore();
  const {
    currentStep,
    formData,
    isLoading,
    error,
    updateFormData,
    nextStep,
    prevStep,
    completeOnboarding,
    setError,
  } = useOnboarding();

  const handleNext = async () => {
    // Validation per step
    if (currentStep === 1) {
      if (!formData.siteName || !formData.ipAddress || !formData.port) {
        setError("Please fill in all required fields");
        return;
      }

      // Validate IP format
      const ipPattern =
        /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
      if (!ipPattern.test(formData.ipAddress)) {
        setError("Please enter a valid IP address");
        return;
      }

      // Validate port
      const portNum = parseInt(formData.port);
      if (isNaN(portNum) || portNum < 1 || portNum > 65535) {
        setError("Please enter a valid port number (1-65535)");
        return;
      }
    }

    if (currentStep === 2) {
      if (!formData.serverType) {
        setError("Please select a server type");
        return;
      }
    }

    if (currentStep === 4) {
      if (
        formData.networkConnectivity !== "success" ||
        formData.agentAuthentication !== "success" ||
        formData.initialDataSync !== "success"
      ) {
        setError("Please wait for all validation checks to complete");
        return;
      }

      // Complete onboarding
      const success = await completeOnboarding();
      if (success) {
        markStepComplete(4);
        markOnboardingComplete();
        router.push("/dashboard");
      }
      return;
    }

    // Mark current step as complete and move to next
    markStepComplete(currentStep);
    await nextStep();
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1PersonalInfo data={formData} onChange={updateFormData} />;
      case 2:
        return <Step2AccountType data={formData} onChange={updateFormData} />;
      case 3:
        return <Step3Verification data={formData} onChange={updateFormData} />;
      case 4:
        return <Step4Security data={formData} onChange={updateFormData} />;
      default:
        return null;
    }
  };

  return (
    <OnboardingLayout helpPanel={<HelpPanel currentStep={currentStep} />}>
      <ProgressIndicator
        currentStep={currentStep}
        totalSteps={4}
        stepTitles={STEP_TITLES}
      />

      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
          <i className="fas fa-exclamation-circle mr-2" />
          {error}
        </div>
      )}

      <div className="mb-8">{renderStep()}</div>

      <div className="flex justify-between pt-6 border-t border-cyber-border">
        <button
          onClick={prevStep}
          disabled={currentStep === 1 || isLoading}
          className="px-6 py-3 bg-cyber-dark hover:bg-cyber-card border border-cyber-border text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <i className="fas fa-arrow-left mr-2" />
          Previous
        </button>

        <button
          onClick={handleNext}
          disabled={isLoading}
          className="px-6 py-3 bg-linear-to-r from-cyber-accent to-cyan-500 hover:from-cyan-500 hover:to-cyber-accent text-cyber-darker font-semibold rounded-lg transition-all duration-200 shadow-glow-cyan disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <i className="fas fa-spinner fa-spin mr-2" />
              Processing...
            </>
          ) : currentStep === 4 ? (
            <>
              Complete Setup
              <i className="fas fa-check ml-2" />
            </>
          ) : (
            <>
              Next
              <i className="fas fa-arrow-right ml-2" />
            </>
          )}
        </button>
      </div>
    </OnboardingLayout>
  );
}
