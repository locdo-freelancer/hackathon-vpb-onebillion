export type ThreatSeverity = "critical" | "high" | "medium" | "low";
export type ThreatType = "ip" | "domain" | "url" | "hash";
export type ThreatStatus = "active" | "blocked" | "flagged" | "monitoring";

export interface ThreatIndicator {
  id: string;
  indicator: string;
  description: string;
  type: ThreatType;
  severity: ThreatSeverity;
  confidence: number; // 0-100
  country: string;
  countryCode: string;
  countryFlag: string;
  firstSeen: string;
  lastSeen: string;
  status: ThreatStatus;
  icon: string;
  iconColor: string;
}

export interface ThreatEnrichment {
  isp?: string;
  asn?: string;
  organization?: string;
  tags: string[];
  malwareFamily?: string;
}

export interface ThreatIntelligence {
  category: string;
  description: string;
  icon: string;
  iconColor: string;
}

export interface ThreatDetail extends ThreatIndicator {
  enrichment: ThreatEnrichment;
  intelligence: ThreatIntelligence[];
  relatedIndicators: Array<{
    id: string;
    indicator: string;
    type: ThreatType;
  }>;
}

export interface ThreatsFilter {
  severity: ThreatSeverity | "all";
  type: ThreatType | "all";
  country: string;
  ipRange: string;
  timeRange: "24h" | "7d" | "30d" | "90d";
  searchQuery: string;
}

export interface ThreatsStats {
  total: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  blocked: number;
}

export interface ThreatsData {
  indicators: ThreatIndicator[];
  stats: ThreatsStats;
}
