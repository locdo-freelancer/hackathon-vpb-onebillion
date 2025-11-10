import React from "react";
import { InputLabel } from "./InputLabel";
import { useTranslations } from "@/hooks/useTranslations";

interface EmailInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  label?: string;
}

export const EmailInput: React.FC<EmailInputProps> = ({
  id,
  value,
  onChange,
  placeholder = "you@company.com",
  required = false,
  label = "email",
}) => {
  const { t } = useTranslations("auth");

  return (
    <div>
      <InputLabel htmlFor={id} required={required}>
        {t(label)}
      </InputLabel>
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
