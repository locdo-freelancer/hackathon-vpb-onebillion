export interface TroubleshootingItem {
  title: string;
  solutions: string[];
}

/**
 * Troubleshooting items configuration
 * Single Responsibility: Only defines troubleshooting data
 * Open/Closed: New items can be added without modifying existing
 */
export const TROUBLESHOOTING_ITEMS: TroubleshootingItem[] = [
  {
    title: "Agent not connecting",
    solutions: [
      "Check outbound HTTPS (443) connectivity to *.securevault.com",
      "Verify firewall allows outbound connections",
      "Ensure installation ran with proper privileges",
    ],
  },
  {
    title: "Installation failed",
    solutions: [
      "Check if curl/wget is installed on your system",
      "Verify you have administrator/root privileges",
      "Check system compatibility and requirements",
    ],
  },
  {
    title: "Authentication issues",
    solutions: [
      "Verify the installation token is correct and active",
      "Check if token has expired or been revoked",
      "Ensure system clock is synchronized (NTP)",
    ],
  },
];

/**
 * Get all troubleshooting items
 */
export const getTroubleshootingItems = (): TroubleshootingItem[] => {
  return TROUBLESHOOTING_ITEMS;
};
