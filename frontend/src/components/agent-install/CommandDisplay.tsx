import React from "react";
import { TabType } from "./InstallationTabs";

interface CommandDisplayProps {
  currentTab: TabType;
  onCopy: (command: string, buttonId: string) => void;
}

const INSTALL_COMMANDS: Record<TabType, string> = {
  linux:
    "curl -sSL https://install.securevault.com/linux | sudo bash -s -- --token=sv_prod_abc123def456ghi789",
  windows:
    'Invoke-WebRequest -Uri "https://install.securevault.com/windows.ps1" | Invoke-Expression; Install-SecureVaultAgent -Token "sv_prod_abc123def456ghi789"',
  mac: "curl -sSL https://install.securevault.com/macos | sudo bash -s -- --token=sv_prod_abc123def456ghi789",
};

const PLATFORM_INFO: Record<
  TabType,
  { title: string; subtitle: string; steps: { title: string; desc: string }[] }
> = {
  linux: {
    title: "Linux Installation",
    subtitle: "Ubuntu, CentOS, RHEL, Debian",
    steps: [
      {
        title: "Run with sudo privileges",
        desc: "The script will detect your distribution automatically",
      },
      {
        title: "Agent starts automatically",
        desc: "Service will be enabled and started after installation",
      },
    ],
  },
  windows: {
    title: "Windows Installation",
    subtitle: "PowerShell 5.1+",
    steps: [
      {
        title: "Run PowerShell as Administrator",
        desc: "Elevated privileges required for service installation",
      },
      {
        title: "Service installs automatically",
        desc: "Windows service will be created and started",
      },
    ],
  },
  mac: {
    title: "macOS Installation",
    subtitle: "macOS 10.15+",
    steps: [
      {
        title: "Run with sudo privileges",
        desc: "System permissions needed for LaunchDaemon",
      },
      {
        title: "LaunchDaemon created",
        desc: "Agent will start on boot automatically",
      },
    ],
  },
};

export const CommandDisplay: React.FC<CommandDisplayProps> = ({
  currentTab,
  onCopy,
}) => {
  const info = PLATFORM_INFO[currentTab];
  const command = INSTALL_COMMANDS[currentTab];
  const buttonId = `copy-btn-${currentTab}`;

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">{info.title}</h3>
        <span className="text-sm text-gray-400">{info.subtitle}</span>
      </div>

      <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-300">
            {currentTab === "windows" ? "PowerShell Command" : "Terminal Command"}
          </span>
          <button
            id={buttonId}
            onClick={() => onCopy(command, buttonId)}
            className="text-cyan-400 hover:text-cyan-300 text-sm transition-colors"
          >
            <i className="fas fa-copy mr-1" />
            Copy
          </button>
        </div>
        <code className="text-sm text-cyan-400 block break-all font-mono">
          {command}
        </code>
      </div>

      <div className="space-y-3 text-sm">
        {info.steps.map((step, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="w-6 h-6 bg-cyan-500/20 rounded-full flex items-center justify-center mt-0.5">
              <span className="text-cyan-400 font-bold text-xs">{index + 1}</span>
            </div>
            <div>
              <p className="text-white font-medium">{step.title}</p>
              <p className="text-gray-400">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
