// Email Input Component - Single Responsibility: Email input field
import React from "react";

interface EmailInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}

export const EmailInput: React.FC<EmailInputProps> = ({
  id,
  value,
  onChange,
  placeholder = "you@company.com",
  required = false,
}) => {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-300 mb-2"
      >
        Email address
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <i className="fas fa-envelope text-gray-500" />
        </div>
        <input
          type="email"
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-cyber-dark border border-cyber-border text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyber-accent focus:border-transparent transition-all duration-200"
          placeholder={placeholder}
          required={required}
        />
      </div>
    </div>
  );
};
