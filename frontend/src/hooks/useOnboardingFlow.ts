import { useOnboardingStore } from "@/stores/onboardingStore";
import { useOnboarding } from "./useOnboarding";
import { validateStep } from "@/lib/validation/onboardingValidation";
import { useRouter } from "next/navigation";

export const useOnboardingFlow = () => {
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
    const validationError = validateStep(currentStep, formData);
    if (validationError) {
      setError(validationError);
      return;
    }

    // Complete onboarding after Step 2 to get install token before Step 3
    if (currentStep === 2) {
      const success = await completeOnboarding();
      if (success) {
        markStepComplete(2);
        // Token is now in formData, Step 3 will have it
        return;
      }
      return;
    }

    if (currentStep === 4) {
      // Just mark as complete and redirect
      markStepComplete(4);
      markOnboardingComplete();
      router.push("/dashboard");
      return;
    }

    markStepComplete(currentStep);
    await nextStep();
  };

  return {
    currentStep,
    formData,
    isLoading,
    error,
    updateFormData,
    prevStep,
    handleNext,
  };
};
