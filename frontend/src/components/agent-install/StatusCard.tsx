import React from "react";
import type { StatusConfig } from "@/config/connection-status.config";

interface StatusCardProps {
  config: StatusConfig;
}

export const StatusCard: React.FC<StatusCardProps> = ({ config }) => {
  return (
    <div
      className={`flex items-center gap-4 p-4 ${config.bgColor} border ${config.borderColor} rounded-lg`}
    >
      <div
        className={`w-10 h-10 ${config.iconBg} rounded-full flex items-center justify-center`}
      >
        <i className={`${config.icon} ${config.textColor}`} />
      </div>
      <div className="flex-1">
        <p className="text-white font-medium">{config.title}</p>
        <p className="text-sm text-gray-400">{config.description}</p>
      </div>
      <div
        className={`w-3 h-3 ${config.dotColor} rounded-full ${
          config.animate ? "animate-pulse" : ""
        }`}
      />
    </div>
  );
};
