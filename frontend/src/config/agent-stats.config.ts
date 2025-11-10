import { useTranslations } from "@/hooks/useTranslations";

export interface StatCardConfig {
  label: string;
  key: "total" | "online" | "offline" | "updating";
  icon: string;
  bgColor: string;
  iconColor: string;
  valueColor: string;
}

/**
 * Configuration for agent statistics cards
 * Single Responsibility: Only defines stat card configurations
 * Open/Closed: New stat types can be added without modifying existing
 */
export const useStatCardsConfig = (): StatCardConfig[] => {
  const { t } = useTranslations("agents");

  return [
    {
      label: t("totalAgents"),
      key: "total",
      icon: "fas fa-desktop",
      bgColor: "bg-cyan-500/20",
      iconColor: "text-cyan-400",
      valueColor: "text-white",
    },
    {
      label: t("online"),
      key: "online",
      icon: "fas fa-circle",
      bgColor: "bg-green-500/20",
      iconColor: "text-green-400",
      valueColor: "text-green-400",
    },
    {
      label: t("offline"),
      key: "offline",
      icon: "fas fa-circle",
      bgColor: "bg-red-500/20",
      iconColor: "text-red-400",
      valueColor: "text-red-400",
    },
    {
      label: t("updating"),
      key: "updating",
      icon: "fas fa-sync-alt",
      bgColor: "bg-yellow-500/20",
      iconColor: "text-yellow-400",
      valueColor: "text-yellow-400",
    },
  ];
};

/**
 * Get stat cards configuration
 */
export const getStatCardsConfig = (): StatCardConfig[] => {
  return [];
};
