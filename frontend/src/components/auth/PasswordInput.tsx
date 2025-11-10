/**
 * Password Input Component
 * Single Responsibility: Password input with strength indicator
 * Open/Closed: Uses password-strength.config for extensibility
 * Dependency Inversion: Depends on config abstraction, not concrete services
 */
"use client";

import React, { useState } from "react";
import {
  calculatePasswordScore,
  getPasswordStrength,
  getPasswordFeedback,
} from "@/config/password-strength.config";
import { InputLabel } from "./InputLabel";
import { PasswordStrengthBar } from "./PasswordStrengthBar";
import { useTranslations } from "@/hooks/useTranslations";

interface PasswordInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  showStrengthIndicator?: boolean;
  label?: string;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  id,
  value,
  onChange,
  placeholder = "••••••••",
  required = false,
  showStrengthIndicator = false,
  label = "password",
}) => {
  const { t } = useTranslations("auth");
  const [showPassword, setShowPassword] = useState(false);

  // Calculate password strength using config
  const score = calculatePasswordScore(value);
  const strength = getPasswordStrength(score);
  const feedback = getPasswordFeedback(value, score);

  return (
    <div>
      <InputLabel htmlFor={id} required={required}>
        {t(label)}
      </InputLabel>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <i className="fas fa-lock text-gray-500" />
        </div>
        <input
          type={showPassword ? "text" : "password"}
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-cyber-dark border border-cyber-border text-white rounded-lg pl-10 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-cyber-accent focus:border-transparent transition-all duration-200"
          placeholder={placeholder}
          required={required}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-300"
        >
          <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`} />
        </button>
      </div>

      {showStrengthIndicator && value.length > 0 && (
        <PasswordStrengthBar
          strength={strength}
          score={score}
          feedback={feedback}
        />
      )}
    </div>
  );
};
