import React from "react";

export type BadgeVariant = "success" | "error" | "warning" | "info" | "default";
export type BadgeSize = "xs" | "sm" | "md";

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: string;
  className?: string;
}

/**
 * Shared Badge Component
 * 
 * Single Responsibility: Renders a badge with consistent styling
 * Interface Segregation: Flexible props for different use cases
 * Reusability: Universal badge component for all modules
 * 
 * Usage:
 * ```tsx
 * <Badge label="Active" variant="success" />
 * <Badge label="Critical" variant="error" icon="fas fa-exclamation" />
 * ```
 */
export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = "default",
  size = "sm",
  icon,
  className = "",
}) => {
  const variantClasses: Record<BadgeVariant, string> = {
    success: "bg-green-500/20 text-green-400 border-green-500/30",
    error: "bg-red-500/20 text-red-400 border-red-500/30",
    warning: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    info: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    default: "bg-slate-500/20 text-slate-400 border-slate-500/30",
  };

  const sizeClasses: Record<BadgeSize, string> = {
    xs: "px-2 py-0.5 text-xs",
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-1.5 text-base",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border font-medium ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {icon && <i className={icon} />}
      {label}
    </span>
  );
};
