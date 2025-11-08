export interface NavItem {
  icon: string;
  label: string;
  href: string;
  active?: boolean;
  badge?: number;
}

export const getNavItems = (currentPath: string): NavItem[] => {
  return [
    {
      icon: "fas fa-gauge-high",
      label: "Dashboard",
      href: "/dashboard",
      active: currentPath === "/dashboard",
    },
    {
      icon: "fas fa-shield-virus",
      label: "Threats",
      href: "/threats",
      active: currentPath === "/threats",
    },
    {
      icon: "fas fa-server",
      label: "Sites",
      href: "/sites",
      active: currentPath === "/sites",
    },
    {
      icon: "fas fa-desktop",
      label: "Agents",
      href: "/agents",
      active: currentPath === "/agents",
    },
    {
      icon: "fas fa-exclamation-triangle",
      label: "Incidents",
      href: "/incidents",
      active: currentPath === "/incidents" || currentPath.startsWith("/incidents/"),
    },
    {
      icon: "fas fa-bolt",
      label: "Action Console",
      href: "/action-console",
      active: currentPath === "/action-console",
    },
    {
      icon: "fas fa-chart-line",
      label: "Reports",
      href: "#",
      active: false,
    },
    {
      icon: "fas fa-cog",
      label: "Settings",
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
