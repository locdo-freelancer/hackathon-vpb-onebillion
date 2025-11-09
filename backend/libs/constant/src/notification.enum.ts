export enum NotificationType {
  INFO = "info",
  WARNING = "warning",
  ERROR = "error",
  SUCCESS = "success",
  ALERT = "alert",
  SECURITY = "security",
  SYSTEM = "system",
}

export enum NotificationPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  URGENT = "urgent",
  CRITICAL = "critical",
}

export enum NotificationChannel {
  IN_APP = "in_app",
  EMAIL = "email",
  SMS = "sms",
  PUSH = "push",
  WEBHOOK = "webhook",
  SLACK = "slack",
  TEAMS = "teams",
}
