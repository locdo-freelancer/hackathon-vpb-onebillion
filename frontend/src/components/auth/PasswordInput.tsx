// Password Input Component - Single Responsibility: Password input with strength indicator
"use client";

import React, { useState } from "react";
import { usePasswordStrength } from "@/hooks/usePasswordStrength";
import { PasswordService } from "@/lib/services/password.service";

interface PasswordInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  showStrengthIndicator?: boolean;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  id,
  value,
  onChange,
  placeholder = "••••••••",
  required = false,
  showStrengthIndicator = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const { validation, showStrength, validatePassword } = usePasswordStrength();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    if (showStrengthIndicator) {
      validatePassword(newValue);
    }
  };

  const strengthColor = PasswordService.getStrengthColor(validation.strength);

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-300 mb-2"
      >
        Password
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <i className="fas fa-lock text-gray-500" />
        </div>
        <input
          type={showPassword ? "text" : "password"}
          id={id}
          value={value}
          onChange={handleChange}
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

      {showStrengthIndicator && showStrength && (
        <div className="mt-2">
          <div className="flex gap-1 mb-1">
            {[1, 2, 3, 4].map((bar) => (
              <div
                key={bar}
                className="h-1 flex-1 bg-cyber-border rounded-full overflow-hidden"
              >
                <div
                  className="h-full transition-all duration-300"
                  style={{
                    width: bar <= validation.score ? "100%" : "0%",
                    backgroundColor:
                      bar <= validation.score ? strengthColor : "transparent",
                  }}
                />
              </div>
            ))}
          </div>
          <p className="text-xs" style={{ color: strengthColor }}>
            Password strength: {validation.feedback}
          </p>
        </div>
      )}
    </div>
  );
};
