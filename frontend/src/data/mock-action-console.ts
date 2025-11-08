import { ActionConsoleData, ActionConsoleStats, AvailableAction, ExecutionHistoryItem } from "@/types/action-console.types";

// Mock data service
export const fetchActionConsoleData = async (): Promise<ActionConsoleData> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const stats: ActionConsoleStats = {
    executed: 47,
    pending: 3,
    failed: 2,
  };

  const availableActions: AvailableAction[] = [
    {
      id: "action-1",
      type: "block-ip",
      title: "Block IP Address",
      description: "Add malicious IP to firewall blocklist across all network segments",
      impact: "high",
      category: "network",
      icon: "fa-ban",
      color: "red",
    },
    {
      id: "action-2",
      type: "isolate-host",
      title: "Isolate Host",
      description: "Disconnect compromised system from network to prevent lateral movement",
      impact: "critical",
      category: "endpoint",
      icon: "fa-network-wired",
      color: "orange",
    },
    {
      id: "action-3",
      type: "revoke-token",
      title: "Revoke Access Token",
      description: "Invalidate compromised authentication tokens and force re-authentication",
      impact: "medium",
      category: "identity",
      icon: "fa-key",
      color: "yellow",
    },
    {
      id: "action-4",
      type: "quarantine-file",
      title: "Quarantine Malicious File",
      description: "Move detected malware to secure quarantine location for analysis",
      impact: "high",
      category: "malware",
      icon: "fa-file-shield",
      color: "purple",
    },
  ];

  const executionHistory: ExecutionHistoryItem[] = [
    {
      id: "history-1",
      actionType: "block-ip",
      title: "Block IP Address",
      description: "IP: 185.234.72.45 added to blocklist",
      status: "completed",
      timestamp: "2 min ago",
      duration: "1.2s",
      executedBy: {
        name: "John Smith",
        avatar: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg",
      },
    },
    {
      id: "history-2",
      actionType: "isolate-host",
      title: "Isolate Host",
      description: "Host: WS-001 disconnected from network",
      status: "completed",
      timestamp: "15 min ago",
      duration: "3.8s",
      executedBy: {
        name: "Sarah Johnson",
        avatar: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg",
      },
    },
    {
      id: "history-3",
      actionType: "revoke-token",
      title: "Revoke Access Token",
      description: "Token: tok_7x9k invalidation in progress",
      status: "in-progress",
      timestamp: "1 min ago",
      elapsed: "45s",
      executedBy: {
        name: "John Smith",
        avatar: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg",
      },
    },
    {
      id: "history-4",
      actionType: "quarantine-file",
      title: "Quarantine Malicious File",
      description: "File: update.exe moved to quarantine",
      status: "completed",
      timestamp: "32 min ago",
      duration: "2.1s",
      executedBy: {
        name: "Alex Chen",
        avatar: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg",
      },
    },
    {
      id: "history-5",
      actionType: "block-ip",
      title: "Block IP Address",
      description: "IP: 203.45.67.89 - Action failed",
      status: "failed",
      timestamp: "1 hour ago",
      error: "Firewall timeout",
      executedBy: {
        name: "Sarah Johnson",
        avatar: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg",
      },
    },
  ];

  return {
    stats,
    availableActions,
    executionHistory,
  };
};