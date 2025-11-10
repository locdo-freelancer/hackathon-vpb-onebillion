"use client";

import React, { useEffect, useState } from "react";
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
import { SitesService } from "@/lib/services/sites.service";
import { AuthService } from "@/lib/services";
import { useTranslations } from "@/hooks/useTranslations";

export default function OnboardingPage() {
  const { t: tOnboarding } = useTranslations("onboarding");
  const { t: tAuth } = useTranslations("auth");
  const router = useRouter();
  const [isCheckingSites, setIsCheckingSites] = useState(true);
  const {
    currentStep,
    formData,
    isLoading,
    error,
    updateFormData,
    prevStep,
    handleNext,
  } = useOnboardingFlow();

  // Check if user already has sites and redirect to dashboard
  useEffect(() => {
    const checkSites = async () => {
      try {
        // Check if user is authenticated
        if (!AuthService.isAuthenticated()) {
          router.push("/login");
          return;
        }

        // Check if user has sites
        const sitesResponse = await SitesService.getAllSites();
        if (sitesResponse.sites && sitesResponse.sites.length > 0) {
          // User already has sites, redirect to dashboard
          router.push("/dashboard");
        } else {
          setIsCheckingSites(false);
        }
      } catch (error) {
        console.error("Error checking sites:", error);
        // If error, allow onboarding to continue
        setIsCheckingSites(false);
      }
    };

    checkSites();
  }, [router]);

  const renderStep = () => {
    const StepComponent = ONBOARDING_STEPS[currentStep - 1]?.component;
    return StepComponent ? (
      <StepComponent data={formData} onChange={updateFormData} />
    ) : null;
  };

  // Show loading while checking sites
  if (isCheckingSites) {
    return (
      <OnboardingLayout helpPanel={<HelpPanel currentStep={1} />}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <i className="fas fa-spinner fa-spin text-4xl text-cyber-accent mb-4" />
            <p className="text-gray-400">{tAuth("checkingAccount")}</p>
          </div>
        </div>
      </OnboardingLayout>
    );
  }

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
          {tOnboarding("previous")}
        </button>

        <button
          onClick={handleNext}
          disabled={isLoading}
          className="px-6 py-3 bg-linear-to-r from-cyber-accent to-cyan-500 hover:from-cyan-500 hover:to-cyber-accent text-cyber-darker font-semibold rounded-lg transition-all duration-200 shadow-glow-cyan disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <i className="fas fa-spinner fa-spin mr-2" />
              {tOnboarding("processing")}
            </>
          ) : currentStep === 4 ? (
            <>
              {tOnboarding("completeSetup")}
              <i className="fas fa-check ml-2" />
            </>
          ) : (
            <>
              {tOnboarding("next")}
              <i className="fas fa-arrow-right ml-2" />
            </>
          )}
        </button>
      </div>
    </OnboardingLayout>
  );
}
