import { Incident, IncidentsData } from "@/types/incidents.types";

// Mock data service
export const fetchIncidentsData = async (): Promise<IncidentsData> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const incidents: Incident[] = [
    {
      id: "1",
      incidentId: "INC-001",
      title: "Advanced Persistent Threat Detected",
      description: "APT detected on web server targeting customer data",
      severity: "critical",
      status: "investigating",
      type: "malware",
      dateCreated: "2024-01-15 14:32",
      assignee: {
        id: "u1",
        name: "Alex Chen",
        avatar:
          "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg",
      },
      affectedSystems: ["web-prod-01", "db-mysql-01"],
      tags: ["apt", "state-sponsored", "critical"],
    },
    {
      id: "2",
      incidentId: "INC-002",
      title: "Phishing Campaign Targeting Employees",
      description: "Sophisticated phishing campaign with fake Microsoft 365 pages",
      severity: "high",
      status: "open",
      type: "phishing",
      dateCreated: "2024-01-15 12:15",
      assignee: {
        id: "u2",
        name: "Sarah Miller",
        avatar:
          "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg",
      },
      affectedSystems: ["email-gateway"],
      tags: ["phishing", "social-engineering"],
    },
    {
      id: "3",
      incidentId: "INC-003",
      title: "DDoS Attack on Public Website",
      description: "Volumetric DDoS attack mitigated by CDN",
      severity: "medium",
      status: "resolved",
      type: "ddos",
      dateCreated: "2024-01-14 09:45",
      assignee: {
        id: "u3",
        name: "Mike Johnson",
        avatar:
          "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-8.jpg",
      },
      affectedSystems: ["cdn", "website"],
      tags: ["ddos", "network"],
    },
    {
      id: "4",
      incidentId: "INC-004",
      title: "Unauthorized Database Access",
      description: "Suspicious queries targeting user credentials",
      severity: "high",
      status: "investigating",
      type: "intrusion",
      dateCreated: "2024-01-13 16:20",
      assignee: {
        id: "u4",
        name: "Lisa Wang",
        avatar:
          "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-6.jpg",
      },
      affectedSystems: ["db-mysql-01"],
      tags: ["intrusion", "database", "credentials"],
    },
    {
      id: "5",
      incidentId: "INC-005",
      title: "Security Policy Violation",
      description: "Employee attempted to access restricted files",
      severity: "low",
      status: "closed",
      type: "policy_violation",
      dateCreated: "2024-01-12 11:30",
      assignee: {
        id: "u5",
        name: "Tom Davis",
        avatar:
          "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-9.jpg",
      },
      affectedSystems: ["file-server"],
      tags: ["policy", "access-control"],
    },
    {
      id: "6",
      incidentId: "INC-006",
      title: "Ransomware Attempt Blocked",
      description: "Ransomware payload detected and blocked",
      severity: "critical",
      status: "resolved",
      type: "ransomware",
      dateCreated: "2024-01-11 08:20",
      assignee: {
        id: "u1",
        name: "Alex Chen",
        avatar:
          "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg",
      },
      affectedSystems: ["workstation-042"],
      tags: ["ransomware", "endpoint", "blocked"],
    },
    {
      id: "7",
      incidentId: "INC-007",
      title: "SQL Injection Vulnerability",
      description: "Critical SQL injection found in web application",
      severity: "critical",
      status: "open",
      type: "vulnerability",
      dateCreated: "2024-01-10 15:30",
      assignee: undefined,
      affectedSystems: ["web-app-prod"],
      tags: ["vulnerability", "sql-injection", "urgent"],
    },
    {
      id: "8",
      incidentId: "INC-008",
      title: "Data Exfiltration Attempt",
      description: "Large data transfer to external IP detected",
      severity: "critical",
      status: "investigating",
      type: "breach",
      dateCreated: "2024-01-09 22:15",
      assignee: {
        id: "u4",
        name: "Lisa Wang",
        avatar:
          "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-6.jpg",
      },
      affectedSystems: ["db-mysql-01", "firewall"],
      tags: ["data-breach", "exfiltration", "urgent"],
    },
  ];

  const stats = {
    total: incidents.length,
    open: incidents.filter((i) => i.status === "open").length,
    investigating: incidents.filter((i) => i.status === "investigating").length,
    resolved: incidents.filter((i) => i.status === "resolved").length,
    closed: incidents.filter((i) => i.status === "closed").length,
    critical: incidents.filter((i) => i.severity === "critical").length,
    high: incidents.filter((i) => i.severity === "high").length,
    medium: incidents.filter((i) => i.severity === "medium").length,
    low: incidents.filter((i) => i.severity === "low").length,
  };

  return {
    incidents,
    stats,
  };
};