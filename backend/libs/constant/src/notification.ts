export enum NotificationType {
  INCIDENT = "incident",
  THREAT = "threat",
  VULNERABILITY = "vulnerability",
  SECURITY_METRIC = "security_metric",
  REMEDIATION = "remediation",
  SYSTEM = "system",
  ALERT = "alert",
  WARNING = "warning",
  INFO = "info",
}

export enum NotificationPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical",
}

export enum NotificationChannel {
  EMAIL = "email",
  SMS = "sms",
  IN_APP = "in_app",
  WEBHOOK = "webhook",
  SLACK = "slack",
}
