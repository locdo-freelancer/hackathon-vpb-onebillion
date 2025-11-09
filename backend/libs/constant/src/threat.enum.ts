export enum ThreatType {
  IP = "ip",
  DOMAIN = "domain",
  URL = "url",
  HASH = "hash",
  MALWARE = "malware",
  RANSOMWARE = "ransomware",
  PHISHING = "phishing",
  SOCIAL_ENGINEERING = "social_engineering",
  NETWORK_ATTACK = "network_attack",
  INSIDER_THREAT = "insider_threat",
  APT = "apt",
  DDOS = "ddos",
  DATA_EXFILTRATION = "data_exfiltration",
  CREDENTIAL_THEFT = "credential_theft",
  PRIVILEGE_ESCALATION = "privilege_escalation",
  LATERAL_MOVEMENT = "lateral_movement",
  PERSISTENCE = "persistence",
  COMMAND_CONTROL = "command_control",
  OTHER = "other",
}

export enum ThreatStatus {
  ACTIVE = "active",
  MONITORING = "monitoring",
  BLOCKED = "blocked",
  MITIGATED = "mitigated",
  RESOLVED = "resolved",
  FALSE_POSITIVE = "false_positive",
}

export enum ThreatSeverity {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical",
}
