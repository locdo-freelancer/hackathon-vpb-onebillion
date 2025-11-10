import { useTranslations } from "@/hooks/useTranslations";

export interface NavItem {
  icon: string;
  label: string;
  href: string;
  active?: boolean;
  badge?: number;
}

export const getNavItems = (currentPath: string): NavItem[] => {
  const { t } = useTranslations("nav");

  return [
    {
      icon: "fas fa-gauge-high",
      label: t("dashboard"),
      href: "/dashboard",
      active: currentPath === "/dashboard",
    },
    {
      icon: "fas fa-shield-virus",
      label: t("threats"),
      href: "/threats",
      active: currentPath === "/threats",
    },
    {
      icon: "fas fa-server",
      label: t("sites"),
      href: "/sites",
      active: currentPath === "/sites",
    },
    {
      icon: "fas fa-desktop",
      label: t("agents"),
      href: "/agents",
      active: currentPath === "/agents",
    },
    {
      icon: "fas fa-exclamation-triangle",
      label: t("incidents"),
      href: "/incidents",
      active: currentPath === "/incidents" || currentPath.startsWith("/incidents/"),
    },
    {
      icon: "fas fa-bolt",
      label: t("actionConsole"),
      href: "/action-console",
      active: currentPath === "/action-console",
    },
    {
      icon: "fas fa-chart-line",
      label: t("reports"),
      href: "#",
      active: false,
    },
    {
      icon: "fas fa-cog",
      label: t("settings"),
      href: "#",
      active: false,
    },
  ];
};

// Default user for all pages (can be replaced with actual user data from auth)
export const getDefaultUser = () => ({
  name: "John Smith",
  role: "Admin",
  avatar: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg",
});
