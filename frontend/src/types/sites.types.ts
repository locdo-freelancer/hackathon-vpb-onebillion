// Sites Management Types - Single Responsibility Principle

export type SiteStatus = "active" | "inactive" | "warning";

export interface Site {
  id: string;
  name: string;
  hostname: string;
  ipAddress: string;
  domains: string[];
  agentCount: number;
  status: SiteStatus;
  icon: string;
  iconGradient: string;
  lastChecked?: string;
}

export interface SitesFilter {
  status: "all" | SiteStatus;
  agentCount: "any" | "0" | "1-5" | "5+";
  searchQuery?: string;
}

export interface BulkAction {
  id: string;
  label: string;
  icon: string;
  variant: "success" | "warning" | "danger";
  action: (siteIds: string[]) => void;
}

export interface SitesData {
  sites: Site[];
  totalSites: number;
  activeSites: number;
  inactiveSites: number;
  warningSites: number;
}

export interface SiteFormData {
  name: string;
  ipAddress: string;
  domains: string[];
  hostname?: string;
}
