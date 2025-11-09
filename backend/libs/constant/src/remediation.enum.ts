export enum RemediationStatus {
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  FAILED = "failed",
  CANCELLED = "cancelled",
  ON_HOLD = "on_hold",
}

export enum RemediationPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical",
}

export enum RemediationType {
  MANUAL = "manual",
  AUTOMATED = "automated",
  SEMI_AUTOMATED = "semi_automated",
  SCHEDULED = "scheduled",
}
