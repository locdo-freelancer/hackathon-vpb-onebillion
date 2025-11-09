// Step 3: Install Agent - Single Responsibility
"use client";

import React, { useState, useEffect } from "react";
import { SiteConfigData } from "@/types/onboarding.types";
import { OnboardingService } from "@/lib/services/onboarding.service";
import { AgentInstallService } from "@/lib/services/agent-install.service";

interface Step3VerificationProps {
  data: SiteConfigData;
  onChange: (updates: Partial<SiteConfigData>) => void;
}

export const Step3Verification: React.FC<Step3VerificationProps> = ({
  data,
  onChange,
}) => {
  const [copied, setCopied] = useState(false);
  const [installCommands, setInstallCommands] = useState<any>(null);
  const [isLoadingCommands, setIsLoadingCommands] = useState(false);

  // Fetch install commands when token is ready
  useEffect(() => {
    const fetchCommands = async () => {
      // Token should already exist from completeOnboarding()
      if (!data.installToken || !data.serverType) {
        console.log("⚠️ Missing token or serverType:", {
          token: data.installToken,
          serverType: data.serverType,
        });
        return;
      }

      // Skip default placeholder token
      if (data.installToken === "sv_abc123def456") {
        console.log("⚠️ Still using default token, waiting for real token...");
        return;
      }

      setIsLoadingCommands(true);
      try {
        console.log(
          "✅ Fetching install commands with token:",
          data.installToken
        );
        const commands = await AgentInstallService.getInstallCommands(
          data.serverType as any,
          data.installToken
        );
        setInstallCommands(commands);
      } catch (error) {
        console.error("Failed to fetch install commands:", error);
      } finally {
        setIsLoadingCommands(false);
      }
    };

    fetchCommands();
  }, [data.installToken, data.serverType]);

  // Get one-liner install command
  const getQuickInstallCommand = () => {
    if (!installCommands) return "Loading...";

    const { download, configure } = installCommands.commands;
    if (!download || !configure) return "Loading...";

    // Extract the direct run command (skip install.sh, use agent.py directly)
    const directRunMatch = configure.match(/python3 agent\.py[^\n]+/);
    if (directRunMatch) {
      const downloadCmd = download
        .split("\n")
        .find((line: string) => line.includes("curl"));
      return `${downloadCmd} && ${directRunMatch[0]}`;
    }

    return configure;
  };

  const installCommand = getQuickInstallCommand();

  const handleCopy = async () => {
    if (!installCommand || isLoadingCommands) return;
    if (installCommand === "Loading...") return;

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
          {/* Installation Command Box */}
          <div className="bg-cyber-dark border border-cyber-border rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-300">
                Installation Command
                {isLoadingCommands && (
                  <span className="ml-2 text-xs text-cyber-accent">
                    <i className="fas fa-spinner fa-spin mr-1" />
                    Loading commands...
                  </span>
                )}
              </span>
              <button
                onClick={handleCopy}
                disabled={
                  isLoadingCommands ||
                  !installCommand ||
                  installCommand === "Loading..."
                }
                className="text-cyber-accent hover:text-cyan-400 text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

            {/* Skeleton or Command */}
            {isLoadingCommands ? (
              <div className="space-y-2 animate-pulse">
                <div className="h-4 bg-cyber-border/30 rounded w-3/4"></div>
                <div className="h-4 bg-cyber-border/30 rounded w-full"></div>
                <div className="h-4 bg-cyber-border/30 rounded w-5/6"></div>
              </div>
            ) : (
              <code className="text-sm text-cyber-accent break-all">
                {installCommand}
              </code>
            )}
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
              ```
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
