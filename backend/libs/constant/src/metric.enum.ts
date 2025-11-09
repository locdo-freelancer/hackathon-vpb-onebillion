export enum MetricType {
  SECURITY_SCORE = "security_score",
  VULNERABILITY_COUNT = "vulnerability_count",
  THREAT_COUNT = "threat_count",
  INCIDENT_COUNT = "incident_count",
  PATCH_COMPLIANCE = "patch_compliance",
  RESPONSE_TIME = "response_time",
  MEAN_TIME_TO_DETECT = "mean_time_to_detect",
  MEAN_TIME_TO_RESPOND = "mean_time_to_respond",
  UPTIME_PERCENTAGE = "uptime_percentage",
  CPU_USAGE = "cpu_usage",
  MEMORY_USAGE = "memory_usage",
  DISK_USAGE = "disk_usage",
  NETWORK_BANDWIDTH = "network_bandwidth",
  FAILED_LOGIN_ATTEMPTS = "failed_login_attempts",
  SUCCESSFUL_LOGIN_ATTEMPTS = "successful_login_attempts",
  OTHER = "other",
}

export enum MetricCategory {
  SECURITY = "security",
  PERFORMANCE = "performance",
  AVAILABILITY = "availability",
  COMPLIANCE = "compliance",
  BUSINESS = "business",
  OPERATIONAL = "operational",
}

export enum AlertThreshold {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical",
}
