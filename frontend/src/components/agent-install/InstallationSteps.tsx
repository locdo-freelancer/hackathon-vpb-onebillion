import React from "react";

interface Step {
  title: string;
  desc: string;
}

interface InstallationStepsProps {
  steps: Step[];
}

export const InstallationSteps: React.FC<InstallationStepsProps> = ({ steps }) => {
  return (
    <div className="space-y-3 text-sm">
      {steps.map((step, index) => (
        <div key={index} className="flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-xs font-semibold text-cyan-400">
              {index + 1}
            </span>
          </div>
          <div>
            <p className="font-medium text-white">{step.title}</p>
            <p className="text-gray-400 mt-0.5">{step.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
