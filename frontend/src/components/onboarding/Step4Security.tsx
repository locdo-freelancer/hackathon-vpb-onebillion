// Step 4: Validation - Single Responsibility
"use client";

import React, { useEffect, useState } from "react";
import { SiteConfigData } from "@/types/onboarding.types";

interface Step4SecurityProps {
  data: SiteConfigData;
  onChange: (updates: Partial<SiteConfigData>) => void;
}

type ValidationStatus = "pending" | "validating" | "success" | "failed";

interface ValidationCheck {
  id: keyof Pick<
    SiteConfigData,
    "networkConnectivity" | "agentAuthentication" | "initialDataSync"
  >;
  label: string;
  description: string;
}

const VALIDATION_CHECKS: ValidationCheck[] = [
  {
    id: "networkConnectivity",
    label: "Network Connectivity",
    description: "Agent can reach SecureVault servers",
  },
  {
    id: "agentAuthentication",
    label: "Agent Authentication",
    description: "Verifying security token...",
  },
  {
    id: "initialDataSync",
    label: "Initial Data Sync",
    description: "Waiting for agent installation...",
  },
];

export const Step4Security: React.FC<Step4SecurityProps> = ({
  data,
  onChange,
}) => {
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    // Auto-start validation when entering this step
    if (!isValidating && data.networkConnectivity === "pending") {
      startValidation();
    }
  }, []);

  const startValidation = async () => {
    setIsValidating(true);

    // Simulate validation process
    // Step 1: Network Connectivity
    onChange({ networkConnectivity: "validating" });
    await new Promise((resolve) => setTimeout(resolve, 1500));
    onChange({ networkConnectivity: "success" });

    // Step 2: Agent Authentication
    onChange({ agentAuthentication: "validating" });
    await new Promise((resolve) => setTimeout(resolve, 2000));
    onChange({ agentAuthentication: "success" });

    // Step 3: Initial Data Sync
    onChange({ initialDataSync: "validating" });
    await new Promise((resolve) => setTimeout(resolve, 2500));
    onChange({ initialDataSync: "success" });

    setIsValidating(false);
  };

  const getStatusIcon = (status: ValidationStatus) => {
    switch (status) {
      case "pending":
        return <i className="fas fa-clock text-gray-500" />;
      case "validating":
        return <i className="fas fa-spinner fa-spin text-yellow-400" />;
      case "success":
        return <i className="fas fa-check text-green-400" />;
      case "failed":
        return <i className="fas fa-times text-red-400" />;
    }
  };

  const getStatusBgColor = (status: ValidationStatus) => {
    switch (status) {
      case "pending":
        return "bg-cyber-border";
      case "validating":
        return "bg-yellow-500/20";
      case "success":
        return "bg-green-500/20";
      case "failed":
        return "bg-red-500/20";
    }
  };

  const allValidated =
    data.networkConnectivity === "success" &&
    data.agentAuthentication === "success" &&
    data.initialDataSync === "success";

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="bg-cyber-card border border-cyber-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Connectivity Validation
        </h3>

        <div className="space-y-4">
          {VALIDATION_CHECKS.map((check) => {
            const status = data[check.id] as ValidationStatus;
            return (
              <div
                key={check.id}
                className="flex items-center gap-3 p-3 bg-cyber-dark rounded-lg"
              >
                <div
                  className={`w-8 h-8 ${getStatusBgColor(
                    status
                  )} rounded-full flex items-center justify-center`}
                >
                  {getStatusIcon(status)}
                </div>
                <div className="flex-1">
                  <p
                    className={`font-medium ${
                      status === "pending" ? "text-gray-400" : "text-white"
                    }`}
                  >
                    {check.label}
                  </p>
                  <p
                    className={`text-sm ${
                      status === "pending" ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    {status === "validating"
                      ? "Verifying..."
                      : status === "pending"
                      ? "Waiting for agent installation..."
                      : check.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {!allValidated && !isValidating && (
          <button
            onClick={startValidation}
            className="w-full mt-4 bg-linear-to-r from-cyber-accent to-cyan-500 hover:from-cyan-500 hover:to-cyber-accent text-cyber-darker font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-glow-cyan"
          >
            <i className="fas fa-rotate-right mr-2" />
            Retry Validation
          </button>
        )}
      </div>

      {allValidated ? (
        <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <i className="fas fa-check-circle text-green-400 mt-1" />
            <div className="text-sm">
              <p className="text-white font-medium mb-1">
                Validation Complete!
              </p>
              <p className="text-gray-300">
                Your monitoring agent is successfully installed and connected.
                Click "Complete Setup" to finish.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-cyber-accent/10 border border-cyber-accent/50 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <i className="fas fa-info-circle text-cyber-accent mt-1" />
            <div className="text-sm">
              <p className="text-white font-medium mb-1">Validation Process</p>
              <p className="text-gray-300">
                This may take a few moments. Please wait for all checks to
                complete.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
