import React from "react";

interface FormButtonProps {
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "outline";
  isLoading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  icon?: string;
}

/**
 * Form Button Component
 * Single Responsibility: Renders a styled button for forms
 * Open/Closed: Configurable via props (variants, loading state)
 * Interface Segregation: Clean props interface for button needs
 */
export const FormButton: React.FC<FormButtonProps> = ({
  type = "button",
  variant = "primary",
  isLoading = false,
  disabled = false,
  fullWidth = true,
  children,
  onClick,
  icon,
}) => {
  const baseClasses = "px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2";
  
  const variantClasses = {
    primary: "bg-linear-to-r from-cyan-500 to-purple-600 text-white hover:shadow-lg hover:shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed",
    secondary: "bg-slate-800 text-white hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed",
    outline: "border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 disabled:opacity-50 disabled:cursor-not-allowed",
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseClasses} ${variantClasses[variant]} ${widthClass}`}
    >
      {isLoading ? (
        <>
          <i className="fas fa-spinner fa-spin" />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {icon && <i className={icon} />}
          {children}
        </>
      )}
    </button>
  );
};
