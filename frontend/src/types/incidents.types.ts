export type IncidentSeverity = "critical" | "high" | "medium" | "low";
export type IncidentStatus = "open" | "investigating" | "resolved" | "closed";
export type IncidentType =
  | "malware"
  | "phishing"
  | "ddos"
  | "intrusion"
  | "data-breach"
  | "policy-violation"
  | "ransomware"
  | "vulnerability";

export interface Incident {
  id: string;
  incidentId: string; // Display ID like INC-001
  title: string;
  description: string;
  aiSummary: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  type: IncidentType;
  dateCreated: string;
  dateUpdated: string;
  assignee: {
    id: string;
    name: string;
    avatar: string;
  } | null;
  affectedSystems: string[];
  tags: string[];
}

export interface IncidentDetail extends Incident {
  timeline: IncidentTimelineEvent[];
  relatedIndicators: string[];
  recommendations: string[];
  evidence: IncidentEvidence[];
  mitreAttack: MitreTechnique[];
  rawLogs: string[];
  aiRecommendations: AIRecommendation[];
  fileHash?: FileHashAnalysis;
  ipReputation?: IPReputation;
  relatedIncidents: RelatedIncident[];
  externalReferences: ExternalReference[];
  sourceIP?: string;
  destinationIP?: string;
  protocol?: string;
}

export interface MitreTechnique {
  id: string;
  name: string;
  tactic: string;
  description: string;
}

export interface AIRecommendation {
  id: string;
  title: string;
  description: string;
  confidence: number;
  approved?: boolean;
}

export interface FileHashAnalysis {
  hash: string;
  algorithm: string;
  threatScore: number;
  firstSeen: string;
  malwareFamily: string;
  detectionCount: number;
}

export interface IPReputation {
  address: string;
  threatScore: number;
  country: string;
  asn: string;
  tags: string[];
}

export interface RelatedIncident {
  id: string;
  title: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  date: string;
}

export interface ExternalReference {
  name: string;
  icon: string;
  url: string;
}

export interface IncidentTimelineEvent {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  details: string;
}

export interface IncidentEvidence {
  id: string;
  type: "log" | "screenshot" | "file" | "network";
  name: string;
  timestamp: string;
  size?: string;
}

export interface IncidentsFilter {
  severity: IncidentSeverity | "all";
  status: IncidentStatus | "all";
  type: IncidentType | "all";
  dateFrom: string;
  dateTo: string;
  assignee: string;
  searchQuery: string;
}

export interface IncidentsStats {
  total: number;
  open: number;
  investigating: number;
  resolved: number;
  closed: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
}

export interface IncidentsData {
  incidents: Incident[];
  stats: IncidentsStats;
}
