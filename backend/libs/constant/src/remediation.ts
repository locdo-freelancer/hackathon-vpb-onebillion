export enum RemediationStatus {
  PENDING = "Pending",
  IN_PROGRESS = "In Progress",
  COMPLETED = "Completed",
  FAILED = "Failed",
  CANCELLED = "Cancelled",
}

export enum RemediationPriority {
  LOW = "Low",
  MEDIUM = "Medium",
  HIGH = "High",
  CRITICAL = "Critical",
}

export enum RemediationType {
  MANUAL = "Manual",
  AUTOMATED = "Automated",
  SEMI_AUTOMATED = "Semi-Automated",
}
