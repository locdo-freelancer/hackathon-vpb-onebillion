import { ActionModalData, ActionType } from "@/types/action-console.types";

// Modal configuration for each action type
export const getModalData = (actionType: ActionType): ActionModalData => {
  const modalConfigs: Record<ActionType, ActionModalData> = {
    "block-ip": {
      type: "block-ip",
      title: "Block IP Address",
      description: "Add IP to firewall blocklist",
      icon: "fa-ban",
      color: "red",
      fields: [
        {
          name: "ipAddress",
          label: "Target IP Address",
          type: "text",
          placeholder: "e.g., 185.234.72.45",
        },
        {
          name: "reason",
          label: "Reason",
          type: "textarea",
          placeholder: "Describe the threat...",
          rows: 3,
        },
      ],
      warningMessage:
        "This will immediately block all traffic from the specified IP address across all network segments.",
      warningType: "high",
    },
    "isolate-host": {
      type: "isolate-host",
      title: "Isolate Host",
      description: "Disconnect system from network",
      icon: "fa-network-wired",
      color: "orange",
      fields: [
        {
          name: "hostIdentifier",
          label: "Host Identifier",
          type: "text",
          placeholder: "e.g., WS-001 or hostname",
        },
        {
          name: "reason",
          label: "Reason",
          type: "textarea",
          placeholder: "Describe the incident...",
          rows: 3,
        },
      ],
      warningMessage:
        "This will immediately disconnect the host from the network, preventing all communications.",
      warningType: "critical",
    },
    "revoke-token": {
      type: "revoke-token",
      title: "Revoke Access Token",
      description: "Invalidate authentication token",
      icon: "fa-key",
      color: "yellow",
      fields: [
        {
          name: "tokenId",
          label: "Token ID",
          type: "text",
          placeholder: "e.g., tok_7x9k...",
        },
        {
          name: "userEmail",
          label: "User Email",
          type: "email",
          placeholder: "user@company.com",
        },
        {
          name: "reason",
          label: "Reason",
          type: "textarea",
          placeholder: "Describe the security concern...",
          rows: 3,
        },
      ],
      warningMessage: "User will be forced to re-authenticate on all devices.",
      warningType: "medium",
    },
    "quarantine-file": {
      type: "quarantine-file",
      title: "Quarantine Malicious File",
      description: "Move file to secure quarantine",
      icon: "fa-file-shield",
      color: "purple",
      fields: [
        {
          name: "filePath",
          label: "File Path",
          type: "text",
          placeholder: "e.g., C:\\Users\\...\\update.exe",
        },
        {
          name: "hostIdentifier",
          label: "Host Identifier",
          type: "text",
          placeholder: "e.g., WS-001",
        },
        {
          name: "detectionDetails",
          label: "Detection Details",
          type: "textarea",
          placeholder: "Malware signature, behavior, etc...",
          rows: 3,
        },
      ],
      warningMessage: "File will be moved to secure quarantine and cannot be executed.",
      warningType: "high",
    },
  };

  return modalConfigs[actionType];
};