import React from "react";

interface FormErrorProps {
  message?: string;
}

/**
 * Form Error Component
 * Single Responsibility: Display form error messages
 * Interface Segregation: Single prop for error message
 */
export const FormError: React.FC<FormErrorProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4">
      <div className="flex items-center gap-2 text-red-400 text-sm">
        <i className="fas fa-exclamation-circle" />
        <span>{message}</span>
      </div>
    </div>
  );
};
