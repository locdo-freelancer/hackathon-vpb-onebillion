import React from "react";

interface InfoRowProps {
  label: string;
  value: string | React.ReactNode;
  valueColor?: string;
  labelColor?: string;
  size?: "xs" | "sm" | "md";
}

/**
 * Shared Info Row Component
 * 
 * Single Responsibility: Renders a single info row with label and value
 * Interface Segregation: Minimal props for flexible info display
 * Reusability: Generic info display for any key-value pair
 * 
 * Usage:
 * ```tsx
 * <InfoRow label="Status" value="Active" valueColor="text-green-400" />
 * <InfoRow label="IP Address" value="192.168.1.1" size="sm" />
 * ```
 */
export const InfoRow: React.FC<InfoRowProps> = ({
  label,
  value,
  valueColor = "text-gray-300",
  labelColor = "text-gray-400",
  size = "xs",
}) => {
  const sizeClasses = {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-base",
  };

  return (
    <div className={`flex justify-between ${sizeClasses[size]}`}>
      <span className={labelColor}>{label}</span>
      <span className={valueColor}>{value}</span>
    </div>
  );
};
