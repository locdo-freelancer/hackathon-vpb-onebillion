import type { TabType } from "@/components/agent-install/InstallationTabs";

export interface TabConfig {
  id: TabType;
  icon: string;
  label: string;
}

/**
 * Configuration for installation tabs
 * Single Responsibility: Only defines tab configurations
 * Open/Closed: New tabs can be added without modifying existing
 */
export const TABS_CONFIG: TabConfig[] = [
  { id: "linux", icon: "fab fa-linux", label: "Linux" },
  { id: "windows", icon: "fab fa-windows", label: "Windows" },
  { id: "mac", icon: "fab fa-apple", label: "macOS" },
];

/**
 * Get all tab configurations
 */
export const getTabsConfig = (): TabConfig[] => {
  return TABS_CONFIG;
};
