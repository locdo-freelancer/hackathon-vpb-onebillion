import React from "react";
import { getDashboardBgEffects } from "@/config/dashboard-states.config";

/**
 * Dashboard Background Component
 * Single Responsibility: Only renders background effects
 * Open/Closed: New effects added via config
 */
export const DashboardBackground: React.FC = () => {
  const effects = getDashboardBgEffects();
  const { topLeftBlur, bottomRightBlur } = effects;

  return (
    <>
      {/* Gradient Overlay */}
      <div className={`absolute inset-0 ${effects.gradientOverlay}`} />
      
      {/* Top Left Blur Effect */}
      <div
        className={`absolute ${topLeftBlur.position} ${topLeftBlur.size} ${topLeftBlur.color} rounded-full ${topLeftBlur.blur}`}
      />
      
      {/* Bottom Right Blur Effect */}
      <div
        className={`absolute ${bottomRightBlur.position} ${bottomRightBlur.size} ${bottomRightBlur.color} rounded-full ${bottomRightBlur.blur}`}
      />
    </>
  );
};
