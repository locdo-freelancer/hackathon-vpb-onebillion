export enum MetricType {
  ATTACK_COUNT = "attack_count",
  VULNERABILITY_COUNT = "vulnerability_count",
  THREAT_LEVEL = "threat_level",
  SECURITY_SCORE = "security_score",
  INCIDENT_COUNT = "incident_count",
  REMEDIATION_RATE = "remediation_rate",
  UPTIME = "uptime",
  DOWNTIME = "downtime",
  RESPONSE_TIME = "response_time",
  COMPLIANCE_SCORE = "compliance_score",
}

export enum MetricCategory {
  SECURITY = "security",
  PERFORMANCE = "performance",
  COMPLIANCE = "compliance",
  OPERATIONAL = "operational",
}

export enum AlertThreshold {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical",
}
