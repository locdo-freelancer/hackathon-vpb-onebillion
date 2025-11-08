import React from "react";

export type StatusVariant = "online" | "offline" | "warning" | "error" | "updating" | "idle";

interface StatusBadgeProps {
  status: StatusVariant;
  label?: string;
  showDot?: boolean;
  size?: "sm" | "md";
}

/**
 * Shared Status Badge Component
 * 
 * Single Responsibility: Renders status badge with colored dot indicator
 * Interface Segregation: Minimal props for status display
 * Reusability: Can be used for any status indication needs
 * 
 * Usage:
 * ```tsx
 * <StatusBadge status="online" label="Online" showDot />
 * <StatusBadge status="error" label="Offline" />
 * ```
 */
export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  showDot = true,
  size = "sm",
}) => {
  const statusConfig: Record<
    StatusVariant,
    { color: string; bgColor: string; label: string }
  > = {
    online: {
      color: "bg-green-400",
      bgColor: "bg-green-500/20 text-green-400 border-green-500/30",
      label: "Online",
    },
    offline: {
      color: "bg-red-400",
      bgColor: "bg-red-500/20 text-red-400 border-red-500/30",
      label: "Offline",
    },
    warning: {
      color: "bg-yellow-400",
      bgColor: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      label: "Warning",
    },
    error: {
      color: "bg-red-400",
      bgColor: "bg-red-500/20 text-red-400 border-red-500/30",
      label: "Error",
    },
    updating: {
      color: "bg-yellow-400 animate-pulse",
      bgColor: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      label: "Updating",
    },
    idle: {
      color: "bg-gray-400",
      bgColor: "bg-gray-500/20 text-gray-400 border-gray-500/30",
      label: "Idle",
    },
  };

  const config = statusConfig[status];
  const sizeClasses = size === "sm" ? "px-3 py-1 text-sm" : "px-4 py-1.5 text-base";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border font-medium ${config.bgColor} ${sizeClasses}`}
    >
      {showDot && <span className={`w-2 h-2 ${config.color} rounded-full`} />}
      {label || config.label}
    </span>
  );
};
