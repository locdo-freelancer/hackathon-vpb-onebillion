import React from "react";

interface SiteCheckboxProps {
  checked: boolean;
  onChange: () => void;
  ariaLabel?: string;
}

/**
 * Site Checkbox Component
 * Single Responsibility: Renders a styled checkbox for site selection
 * Interface Segregation: Minimal props - checked state and onChange handler
 */
export const SiteCheckbox: React.FC<SiteCheckboxProps> = ({
  checked,
  onChange,
  ariaLabel = "Select site",
}) => {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      aria-label={ariaLabel}
      className="w-4 h-4 bg-slate-950 border border-slate-800 rounded accent-cyan-500 cursor-pointer hover:border-cyan-500/50 transition-colors"
    />
  );
};
