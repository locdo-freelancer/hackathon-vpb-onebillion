import React from "react";

interface SiteIconProps {
  icon: string;
  gradient: string;
  alt: string;
}

/**
 * Site Icon Component
 * Single Responsibility: Renders site icon with gradient background
 * Interface Segregation: Only icon, gradient, and alt text props
 */
export const SiteIcon: React.FC<SiteIconProps> = ({ icon, gradient, alt }) => {
  return (
    <div
      className={`w-8 h-8 ${gradient} rounded-lg flex items-center justify-center shrink-0`}
      title={alt}
    >
      <i className={`${icon} text-white text-sm`} />
    </div>
  );
};
