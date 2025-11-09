export enum IncidentSeverity {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical",
}

export enum IncidentStatus {
  OPEN = "open",
  INVESTIGATING = "investigating",
  IN_PROGRESS = "in_progress",
  RESOLVED = "resolved",
  CLOSED = "closed",
  CANCELLED = "cancelled",
}

export enum IncidentType {
  MALWARE = "malware",
  PHISHING = "phishing",
  NETWORK_INTRUSION = "network_intrusion",
  DATA_BREACH = "data_breach",
  DDOS = "ddos",
  INSIDER_THREAT = "insider_threat",
  VULNERABILITY_EXPLOIT = "vulnerability_exploit",
  SUSPICIOUS_ACTIVITY = "suspicious_activity",
  POLICY_VIOLATION = "policy_violation",
  OTHER = "other",
}
