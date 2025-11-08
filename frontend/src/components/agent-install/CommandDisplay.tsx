import React from "react";
import { TabType } from "./InstallationTabs";
import { CodeBlock } from "@/components/shared";
import { InstallationSteps } from "./InstallationSteps";
import { getInstallCommand, getPlatformInfo } from "@/config/installation.config";

interface CommandDisplayProps {
  currentTab: TabType;
  onCopy: (command: string, buttonId: string) => void;
}

export const CommandDisplay: React.FC<CommandDisplayProps> = ({
  currentTab,
  onCopy,
}) => {
  const info = getPlatformInfo(currentTab);
  const command = getInstallCommand(currentTab);
  const buttonId = `copy-btn-${currentTab}`;
  const language = currentTab === "windows" ? "powershell" : "bash";

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">{info.title}</h3>
        <span className="text-sm text-gray-400">{info.subtitle}</span>
      </div>

      <div className="mb-4">
        <CodeBlock
          code={command}
          language={language}
          onCopy={onCopy}
          buttonId={buttonId}
        />
      </div>

      <InstallationSteps steps={info.steps} />
    </div>
  );
};
