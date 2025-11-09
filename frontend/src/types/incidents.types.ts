// Aligned with Backend API responses
export type IncidentSeverity = "critical" | "high" | "medium" | "low";
export type IncidentStatus = "open" | "investigating" | "resolved" | "closed";
export type IncidentType =
  | "malware"
  | "phishing"
  | "ddos"
  | "breach" // Changed from "data-breach" to match BE
  | "policy_violation" // Changed from "policy-violation" to match BE
  | "vulnerability"
  | "ransomware"
  | "intrusion";

export interface Assignee {
  id: string;
  name: string;
  avatar?: string; // Optional to match BE
}

export interface Incident {
  id: string;
  incidentId: string; // Display ID like INC-001
  title: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  type: IncidentType;
  dateCreated: string;
  assignee?: Assignee; // Changed to optional Assignee type
  affectedSystems: string[];
  tags: string[];
  description?: string; // Optional - returned in detail view
  timeline?: TimelineEvent[]; // Optional - returned in detail view
  mitreAttack?: string[]; // Optional - returned in detail view
  aiRecommendations?: string[]; // Optional - returned in detail view
  relatedIncidents?: string[]; // Optional - returned in detail view
  // Removed UI-only fields: aiSummary, dateUpdated
}

export interface IncidentDetail extends Omit<Incident, 'timeline' | 'mitreAttack' | 'relatedIncidents' | 'aiRecommendations'> {
  timeline: IncidentTimelineEvent[]; // Override with extended type for UI
  mitreAttack: MitreTechnique[]; // Override with detailed objects for UI
  relatedIncidents: RelatedIncident[]; // Override with detailed objects for UI
  aiRecommendations: AIRecommendation[]; // Override with detailed objects for UI
  relatedIndicators: string[];
  recommendations: string[];
  evidence: IncidentEvidence[];
  rawLogs: string[];
  fileHash?: FileHashAnalysis;
  ipReputation?: IPReputation;
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

export interface TimelineEvent {
  timestamp: string;
  event: string;
  user?: string;
  details?: string;
}

// UI-specific extended timeline event with icon
export interface IncidentTimelineEvent extends TimelineEvent {
  id: string;
  action: string;
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
