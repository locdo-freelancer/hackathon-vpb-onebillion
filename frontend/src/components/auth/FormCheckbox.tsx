import React from "react";

interface FormCheckboxProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

/**
 * Form Checkbox Component
 * Single Responsibility: Renders a styled checkbox with label
 * Interface Segregation: Minimal props for checkbox needs
 */
export const FormCheckbox: React.FC<FormCheckboxProps> = ({
  id,
  checked,
  onChange,
  label,
}) => {
  return (
    <div className="flex items-center">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-slate-950 cursor-pointer"
      />
      <label
        htmlFor={id}
        className="ml-2 text-sm text-gray-400 cursor-pointer hover:text-gray-300 transition-colors"
      >
        {label}
      </label>
    </div>
  );
};
