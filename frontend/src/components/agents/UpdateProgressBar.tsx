import React from "react";

interface UpdateProgressBarProps {
  progress?: number;
}

/**
 * Update Progress Bar Component
 * Single Responsibility: Renders update progress bar with animation
 * Interface Segregation: Only needs progress percentage
 */
export const UpdateProgressBar: React.FC<UpdateProgressBarProps> = ({
  progress = 0,
}) => {
  return (
    <div className="w-full bg-slate-950 rounded-full h-1">
      <div
        className="bg-yellow-400 h-1 rounded-full transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};
