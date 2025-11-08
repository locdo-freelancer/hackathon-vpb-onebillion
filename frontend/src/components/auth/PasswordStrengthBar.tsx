import React from "react";
import { PasswordStrength } from "@/types/auth.types";
import {
  getPasswordStrengthConfig,
  getStrengthPercentage,
} from "@/config/password-strength.config";

interface PasswordStrengthBarProps {
  strength: PasswordStrength;
  score: number;
  feedback: string;
}

/**
 * Password Strength Bar Component
 * Single Responsibility: Display password strength indicator
 * Open/Closed: Uses configuration for colors and labels
 * Dependency Inversion: Depends on password-strength.config abstraction
 */
export const PasswordStrengthBar: React.FC<PasswordStrengthBarProps> = ({
  strength,
  score,
  feedback,
}) => {
  const config = getPasswordStrengthConfig(strength);
  const percentage = getStrengthPercentage(score);

  return (
    <div className="mt-2 space-y-2">
      {/* Progress Bar */}
      <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full ${config.bgColor} transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Feedback */}
      <div className="flex items-center justify-between text-xs">
        <span className={config.textColor}>{config.label}</span>
        <span className="text-gray-500">{feedback}</span>
      </div>
    </div>
  );
};
