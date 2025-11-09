import React from "react";
import { TabType } from "./InstallationTabs";
import { CodeBlock } from "@/components/shared";
import { InstallationSteps } from "./InstallationSteps";
import { getPlatformInfo } from "@/config/installation.config";
import { useInstallCommands } from "@/hooks/useInstallCommands";
import type { Platform } from "@/types/agent-install.types";

interface CommandDisplayProps {
  currentTab: TabType;
  onCopy: (command: string, buttonId: string) => void;
  installToken?: string;
}

export const CommandDisplay: React.FC<CommandDisplayProps> = ({
  currentTab,
  onCopy,
  installToken,
}) => {
  // Map TabType to Platform (mac -> linux for API)
  const platformMap: Record<TabType, Platform> = {
    linux: "linux",
    windows: "windows",
    mac: "linux", // macOS uses linux commands
  };

  const platform = platformMap[currentTab];
  const { commands, loading, error } = useInstallCommands(
    platform,
    installToken
  );

  const info = getPlatformInfo(currentTab);
  const buttonId = `copy-btn-${currentTab}`;
  const language = currentTab === "windows" ? "powershell" : "bash";

  // Build full command from API response
  const getFullCommand = (): string => {
    if (!commands) return "";

    const cmdList = commands.commands;

    // For docker
    if (platform === "docker") {
      return `${cmdList.pull || ""}\n\n${cmdList.run || ""}`.trim();
    }

    // For linux/windows
    const parts = [
      cmdList.download,
      cmdList.install,
      cmdList.configure,
      cmdList.start,
    ].filter(Boolean);

    return parts.join("\n");
  };

  const fullCommand = getFullCommand();

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">{info.title}</h3>
        <span className="text-sm text-gray-400">{info.subtitle}</span>
      </div>

      <div className="mb-4">
        {loading ? (
          <div className="bg-slate-800/50 rounded-lg p-4">
            <div className="space-y-2 animate-pulse">
              <div className="h-4 bg-slate-700/50 rounded w-3/4"></div>
              <div className="h-4 bg-slate-700/50 rounded w-full"></div>
              <div className="h-4 bg-slate-700/50 rounded w-5/6"></div>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
            <p className="text-red-400 text-sm">
              <i className="fas fa-exclamation-circle mr-2" />
              {error}
            </p>
          </div>
        ) : (
          <CodeBlock
            code={fullCommand}
            language={language}
            onCopy={onCopy}
            buttonId={buttonId}
          />
        )}
      </div>

      <InstallationSteps steps={info.steps} />
    </div>
  );
};
