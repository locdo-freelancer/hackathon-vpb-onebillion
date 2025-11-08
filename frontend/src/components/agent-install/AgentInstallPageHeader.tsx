import React from "react";

interface AgentInstallPageHeaderProps {
  title?: string;
  description?: string;
}

/**
 * Presentational component for Agent Install page header
 * Single Responsibility: Only renders page title and description
 */
export const AgentInstallPageHeader: React.FC<AgentInstallPageHeaderProps> = ({
  title = "Install SecureVault Agent",
  description = "Deploy our monitoring agent to start securing your infrastructure",
}) => {
  return (
    <div className="mb-8">
      <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
      <p className="text-gray-400">{description}</p>
    </div>
  );
};
