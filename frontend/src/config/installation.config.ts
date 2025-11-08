import type { TabType } from "@/components/agent-install/InstallationTabs";

export interface PlatformInfo {
  title: string;
  subtitle: string;
  steps: { title: string; desc: string }[];
}

/**
 * Installation commands for each platform
 * Single Responsibility: Only defines installation commands
 */
export const INSTALL_COMMANDS: Record<TabType, string> = {
  linux:
    "curl -sSL https://install.securevault.com/linux | sudo bash -s -- --token=sv_prod_abc123def456ghi789",
  windows:
    'Invoke-WebRequest -Uri "https://install.securevault.com/windows.ps1" | Invoke-Expression; Install-SecureVaultAgent -Token "sv_prod_abc123def456ghi789"',
  mac: "curl -sSL https://install.securevault.com/macos | sudo bash -s -- --token=sv_prod_abc123def456ghi789",
};

/**
 * Platform-specific information and installation steps
 * Single Responsibility: Only defines platform information
 * Open/Closed: New platforms can be added without modifying existing
 */
export const PLATFORM_INFO: Record<TabType, PlatformInfo> = {
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

/**
 * Get installation command for a platform
 */
export const getInstallCommand = (platform: TabType): string => {
  return INSTALL_COMMANDS[platform];
};

/**
 * Get platform information
 */
export const getPlatformInfo = (platform: TabType): PlatformInfo => {
  return PLATFORM_INFO[platform];
};
