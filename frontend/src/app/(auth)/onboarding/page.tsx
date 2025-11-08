"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { OnboardingLayout } from "@/components/onboarding/OnboardingLayout";
import { ProgressIndicator } from "@/components/onboarding/ProgressIndicator";
import { HelpPanel } from "@/components/onboarding/HelpPanel";
import { useOnboarding } from "@/hooks/useOnboarding";
import { useOnboardingStore } from "@/stores/onboardingStore";
import { validateStep } from "@/lib/validation/onboardingValidation";
import {
  ONBOARDING_STEPS,
  STEP_TITLES,
  TOTAL_STEPS,
} from "@/config/onboarding.config";
import { useOnboardingFlow } from "@/hooks/useOnboardingFlow";

export default function OnboardingPage() {
  const {
    currentStep,
    formData,
    isLoading,
    error,
    updateFormData,
    prevStep,
    handleNext,
  } = useOnboardingFlow();

  const renderStep = () => {
    const StepComponent = ONBOARDING_STEPS[currentStep - 1]?.component;
    return StepComponent ? (
      <StepComponent data={formData} onChange={updateFormData} />
    ) : null;
  };

  return (
    <OnboardingLayout helpPanel={<HelpPanel currentStep={currentStep} />}>
      <ProgressIndicator
        currentStep={currentStep}
        totalSteps={TOTAL_STEPS}
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
