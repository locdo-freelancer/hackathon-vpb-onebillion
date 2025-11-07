// Progress Indicator - Single Responsibility: Display progress steps
import React from "react";

interface ProgressStep {
  number: number;
  title: string;
  current: boolean;
  completed: boolean;
}

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepTitles: string[];
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentStep,
  totalSteps,
  stepTitles,
}) => {
  const steps: ProgressStep[] = stepTitles.map((title, index) => ({
    number: index + 1,
    title,
    current: index + 1 === currentStep,
    completed: index + 1 < currentStep,
  }));

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-white">Site Configuration</h2>
        <span className="text-sm text-gray-400">
          Step {currentStep} of {totalSteps}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-200 ${
                  step.completed
                    ? "bg-green-500 text-white"
                    : step.current
                    ? "bg-cyber-accent text-cyber-darker"
                    : "bg-cyber-border text-gray-500"
                }`}
              >
                {step.completed ? <i className="fas fa-check" /> : step.number}
              </div>
              <span
                className={`ml-2 text-sm transition-all duration-200 ${
                  step.completed
                    ? "text-green-400 font-medium"
                    : step.current
                    ? "text-white font-medium"
                    : "text-gray-500"
                }`}
              >
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className="w-12 h-0.5 bg-cyber-border" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
