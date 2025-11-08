import {
  Step1PersonalInfo,
  Step2AccountType,
  Step3Verification,
  Step4Security,
} from "@/components/onboarding";

export const ONBOARDING_STEPS = [
  {
    title: "Site Details",
    component: Step1PersonalInfo,
  },
  {
    title: "Server Type",
    component: Step2AccountType,
  },
  {
    title: "Install Agent",
    component: Step3Verification,
  },
  {
    title: "Validation",
    component: Step4Security,
  },
];

export const STEP_TITLES = [
  "Site Details",
  "Server Type",
  "Install Agent",
  "Validation",
];

export const TOTAL_STEPS = STEP_TITLES.length;