// Step 3: Install Agent - Single Responsibility
"use client";

import React, { useState } from "react";
import { SiteConfigData } from "@/types/onboarding.types";

interface Step3VerificationProps {
  data: SiteConfigData;
  onChange: (updates: Partial<SiteConfigData>) => void;
}

export const Step3Verification: React.FC<Step3VerificationProps> = ({
  data,
}) => {
  const [copied, setCopied] = useState(false);

  const installCommand = `curl -sSL https://install.securevault.com/agent | bash -s -- --token=${
    data.installToken || "sv_abc123def456"
  }`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(installCommand);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="bg-cyber-card border border-cyber-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Agent Installation
        </h3>

        <div className="space-y-4">
          <div className="bg-cyber-dark border border-cyber-border rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-300">
                Installation Command
              </span>
              <button
                onClick={handleCopy}
                className="text-cyber-accent hover:text-cyan-400 text-sm transition-colors"
              >
                {copied ? (
                  <>
                    <i className="fas fa-check mr-1" />
                    Copied
                  </>
                ) : (
                  <>
                    <i className="fas fa-copy mr-1" />
                    Copy
                  </>
                )}
              </button>
            </div>
            <code className="text-sm text-cyber-accent break-all">
              {installCommand}
            </code>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3 text-sm">
              <div className="w-6 h-6 bg-cyber-accent/20 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-cyber-accent font-bold text-xs">1</span>
              </div>
              <div>
                <p className="text-white font-medium">
                  Run the command above on your server
                </p>
                <p className="text-gray-400">
                  This will download and install the SecureVault agent
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-sm">
              <div className="w-6 h-6 bg-cyber-border rounded-full flex items-center justify-center mt-0.5">
                <span className="text-gray-500 font-bold text-xs">2</span>
              </div>
              <div>
                <p className="text-gray-400">
                  The agent will automatically start monitoring
                </p>
                <p className="text-gray-500">
                  Initial sync may take 2-3 minutes
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <i className="fas fa-exclamation-triangle text-yellow-400 mt-1" />
          <div className="text-sm">
            <p className="text-white font-medium mb-1">Network Requirements</p>
            <p className="text-gray-300">
              Ensure your server has outbound HTTPS access on port 443 to reach
              SecureVault monitoring servers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
