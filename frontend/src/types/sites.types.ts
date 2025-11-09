// Sites Management Types - Single Responsibility Principle
// Aligned with Backend API responses

export type SiteStatus = "active" | "inactive" | "warning";

export interface Site {
  id: string;
  name: string;
  hostname: string;
  ipAddress: string;
  domains?: string[]; // Optional - may not be returned from BE
  agentCount: number;
  status: SiteStatus;
  icon: string;
  iconGradient: string;
  lastChecked: string;
  port?: string; // Backend returns this
  createdAt?: number;
  updatedAt?: number;
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
  port?: string;
  serverType?: "linux" | "windows" | "docker";
}
