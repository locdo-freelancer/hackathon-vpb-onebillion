import React from "react";

interface InputLabelProps {
  htmlFor: string;
  required?: boolean;
  children: React.ReactNode;
}

/**
 * Input Label Component
 * Single Responsibility: Renders a form label with optional required indicator
 * Interface Segregation: Minimal props for label needs
 */
export const InputLabel: React.FC<InputLabelProps> = ({
  htmlFor,
  required = false,
  children,
}) => {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-sm font-medium text-gray-300 mb-2"
    >
      {children}
      {required && <span className="text-red-400 ml-1">*</span>}
    </label>
  );
};
