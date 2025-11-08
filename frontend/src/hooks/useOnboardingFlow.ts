import { useOnboardingStore } from "@/stores/onboardingStore";
import { useOnboarding } from "./useOnboarding";
import { validateStep } from "@/lib/validation/onboardingValidation";
import { useRouter } from "next/navigation";

export const useOnboardingFlow =() => {
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

    if (currentStep === 4) {
      const success = await completeOnboarding();
      if (success) {
        markStepComplete(4);
        markOnboardingComplete();
        router.push("/agent-install");
      }
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
  }
}