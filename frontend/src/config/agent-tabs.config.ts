/**
 * Agent Tabs Configuration
 * 
 * Single Responsibility Principle (SRP):
 * - Only defines tabs configuration data
 * 
 * Open/Closed Principle (OCP):
 * - New tabs can be added via configuration without modifying component code
 */

export type TabId = "all" | "online" | "offline" | "updating";

export interface TabConfig {
  id: TabId;
  label: string;
}

/**
 * Tabs configuration array
 * Defines all available agent filter tabs
 */
export const TABS_CONFIG: TabConfig[] = [
  { id: "all", label: "Tất cả" },
  { id: "online", label: "Hoạt động" },
  { id: "offline", label: "Ngoại tuyến" },
  { id: "updating", label: "Đang cập nhật" },
];

/**
 * Get tabs configuration with count labels
 * @returns Array of tab configurations
 */
export const getTabsConfig = (): TabConfig[] => {
  return TABS_CONFIG;
};

/**
 * Get tab label by ID
 * @param tabId - Tab identifier
 * @returns Tab label or "Tất cả" as default
 */
export const getTabLabel = (tabId: TabId): string => {
  const tab = TABS_CONFIG.find((t) => t.id === tabId);
  return tab?.label || "Tất cả";
};
