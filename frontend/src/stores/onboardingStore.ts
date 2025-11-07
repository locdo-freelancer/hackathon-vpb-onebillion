// Onboarding Store - Global state management for onboarding
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface OnboardingState {
  isOnboardingComplete: boolean;
  currentStep: number;
  completedSteps: number[];
  markStepComplete: (step: number) => void;
  setCurrentStep: (step: number) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      isOnboardingComplete: false,
      currentStep: 1,
      completedSteps: [],

      markStepComplete: (step) =>
        set((state) => ({
          completedSteps: [...new Set([...state.completedSteps, step])],
        })),

      setCurrentStep: (step) => set({ currentStep: step }),

      completeOnboarding: () => set({ isOnboardingComplete: true }),

      resetOnboarding: () =>
        set({
          isOnboardingComplete: false,
          currentStep: 1,
          completedSteps: [],
        }),
    }),
    {
      name: "onboarding-storage",
    }
  )
);
