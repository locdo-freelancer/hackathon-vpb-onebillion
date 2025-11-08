export type ActionStatus = "completed" | "in-progress" | "failed" | "pending";
export type ActionType = "block-ip" | "isolate-host" | "revoke-token" | "quarantine-file";
export type ActionImpact = "critical" | "high" | "medium" | "low";
export type ActionCategory = "network" | "endpoint" | "identity" | "malware";

export interface ActionConsoleStats {
  executed: number;
  pending: number;
  failed: number;
}

export interface AvailableAction {
  id: string;
  type: ActionType;
  title: string;
  description: string;
  impact: ActionImpact;
  category: ActionCategory;
  icon: string;
  color: string;
}

export interface ExecutionHistoryItem {
  id: string;
  actionType: ActionType;
  title: string;
  description: string;
  status: ActionStatus;
  timestamp: string;
  duration?: string;
  elapsed?: string;
  error?: string;
  executedBy: {
    name: string;
    avatar: string;
  };
}

export interface ActionModalData {
  type: ActionType;
  title: string;
  description: string;
  icon: string;
  color: string;
  fields: ActionField[];
  warningMessage: string;
  warningType: "critical" | "high" | "medium";
}

export interface ActionField {
  name: string;
  label: string;
  type: "text" | "email" | "textarea";
  placeholder: string;
  rows?: number;
}

export interface ActionConsoleData {
  stats: ActionConsoleStats;
  availableActions: AvailableAction[];
  executionHistory: ExecutionHistoryItem[];
}
