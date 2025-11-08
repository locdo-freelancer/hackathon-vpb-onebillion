import React from "react";

interface TabButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  icon?: string;
  disabled?: boolean;
}

/**
 * Shared Tab Button Component
 * 
 * Single Responsibility: Renders a single tab button
 * Interface Segregation: Minimal props for tab functionality
 * Reusability: Can be used in any tabbed interface
 * 
 * Usage:
 * ```tsx
 * <TabButton 
 *   label="Overview" 
 *   isActive={activeTab === 'overview'}
 *   onClick={() => setActiveTab('overview')}
 * />
 * ```
 */
export const TabButton: React.FC<TabButtonProps> = ({
  label,
  isActive,
  onClick,
  icon,
  disabled = false,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
        isActive
          ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
          : "text-gray-400 hover:text-white"
      } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
    >
      {icon && <i className={`${icon} mr-2`} />}
      {label}
    </button>
  );
};
