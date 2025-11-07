import { useState, useEffect } from "react";
import type {
  Incident,
  IncidentsData,
  IncidentsFilter,
  IncidentDetail,
  IncidentsStats,
} from "@/types/incidents.types";

// Mock data service
const fetchIncidentsData = async (): Promise<IncidentsData> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const incidents: Incident[] = [
    {
      id: "1",
      incidentId: "INC-001",
      title: "Advanced Persistent Threat Detected",
      description: "APT detected on web server targeting customer data",
      aiSummary:
        "Advanced persistent threat detected on web server. Multiple indicators suggest state-sponsored attack targeting customer data...",
      severity: "critical",
      status: "investigating",
      type: "malware",
      dateCreated: "2024-01-15 14:32",
      dateUpdated: "2024-01-15 15:45",
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
      aiSummary:
        "Sophisticated phishing campaign targeting employees with fake Microsoft 365 login pages. 15 users clicked malicious links...",
      severity: "high",
      status: "open",
      type: "phishing",
      dateCreated: "2024-01-15 12:15",
      dateUpdated: "2024-01-15 12:15",
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
      aiSummary:
        "Volumetric DDoS attack against public website. Peak traffic reached 50Gbps. Attack mitigated by CDN protection...",
      severity: "medium",
      status: "resolved",
      type: "ddos",
      dateCreated: "2024-01-14 09:45",
      dateUpdated: "2024-01-14 11:30",
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
      aiSummary:
        "Unauthorized access detected on database server. Suspicious queries executed targeting user credentials table...",
      severity: "high",
      status: "investigating",
      type: "intrusion",
      dateCreated: "2024-01-13 16:20",
      dateUpdated: "2024-01-13 18:45",
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
      aiSummary:
        "Employee attempted to access restricted files. Security policy enforced and access denied. User notified...",
      severity: "low",
      status: "closed",
      type: "policy-violation",
      dateCreated: "2024-01-12 11:30",
      dateUpdated: "2024-01-12 14:00",
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
      aiSummary:
        "Ransomware payload detected attempting to encrypt files. EDR solution blocked execution and isolated endpoint...",
      severity: "critical",
      status: "resolved",
      type: "ransomware",
      dateCreated: "2024-01-11 08:20",
      dateUpdated: "2024-01-11 10:45",
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
      aiSummary:
        "Critical SQL injection vulnerability discovered in web application login page. Exploit allows unauthorized database access...",
      severity: "critical",
      status: "open",
      type: "vulnerability",
      dateCreated: "2024-01-10 15:30",
      dateUpdated: "2024-01-10 15:30",
      assignee: null,
      affectedSystems: ["web-app-prod"],
      tags: ["vulnerability", "sql-injection", "urgent"],
    },
    {
      id: "8",
      incidentId: "INC-008",
      title: "Data Exfiltration Attempt",
      description: "Large data transfer to external IP detected",
      aiSummary:
        "Unusual large data transfer detected from internal database to external IP address. Potential data breach in progress...",
      severity: "critical",
      status: "investigating",
      type: "data-breach",
      dateCreated: "2024-01-09 22:15",
      dateUpdated: "2024-01-10 09:30",
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

// Mock incident detail fetcher
const fetchIncidentDetail = async (id: string): Promise<IncidentDetail> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const data = await fetchIncidentsData();
  const incident = data.incidents.find((i) => i.id === id);

  if (!incident) {
    throw new Error("Incident not found");
  }

  return {
    ...incident,
    sourceIP: "192.168.1.105",
    destinationIP: "185.234.72.45",
    protocol: "HTTPS",
    timeline: [
      {
        id: "t1",
        timestamp: "2024-01-15 14:32:00",
        action: "Malicious File Detected",
        user: "EDR Agent",
        details: "Suspicious executable detected on endpoint: malware.exe",
      },
      {
        id: "t2",
        timestamp: "2024-01-15 14:33:15",
        action: "Network Connection Established",
        user: "Firewall",
        details: "Outbound connection to known C2 server: 185.234.72.45",
      },
      {
        id: "t3",
        timestamp: "2024-01-15 14:34:30",
        action: "Registry Modification",
        user: "EDR Agent",
        details: "Persistence mechanism detected in HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Run",
      },
      {
        id: "t4",
        timestamp: "2024-01-15 14:35:45",
        action: "Incident Created",
        user: "SIEM",
        details: "Automated detection triggered incident creation based on threat correlation",
      },
    ],
    mitreAttack: [
      {
        id: "T1566.001",
        name: "Spearphishing Attachment",
        tactic: "Initial Access",
        description: "Adversary sent spearphishing email with malicious attachment",
      },
      {
        id: "T1547.001",
        name: "Registry Run Keys / Startup Folder",
        tactic: "Persistence",
        description: "Malware modified registry to maintain persistence",
      },
      {
        id: "T1071.001",
        name: "Web Protocols",
        tactic: "Command and Control",
        description: "C2 communication using HTTPS protocol",
      },
    ],
    rawLogs: [
      "[2024-01-15 14:32:00] [WARNING] EDR: Suspicious file detected - SHA256: a3c7b2e1f4d5c6a8b9e0d1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2",
      "[2024-01-15 14:33:15] [ERROR] Firewall: Blocked outbound connection to 185.234.72.45:443 - Known C2 server",
      "[2024-01-15 14:34:30] [CRITICAL] EDR: Registry modification detected - Path: HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Run",
      "[2024-01-15 14:35:45] [INFO] SIEM: Incident INC-001 created - APT detected with high confidence",
      "[2024-01-15 14:36:00] [INFO] Analyst: Incident assigned to Alex Chen for investigation",
    ],
    aiRecommendations: [
      {
        id: "rec1",
        title: "Isolate Affected System",
        description: "Immediately isolate endpoint web-prod-01 from the network to prevent lateral movement",
        confidence: 95,
      },
      {
        id: "rec2",
        title: "Block C2 Server",
        description: "Add IP 185.234.72.45 to firewall blocklist to prevent further communication",
        confidence: 88,
      },
      {
        id: "rec3",
        title: "Scan All Systems",
        description: "Deploy IOC hunt across all endpoints to identify potential lateral movement",
        confidence: 72,
      },
    ],
    fileHash: {
      hash: "a3c7b2e1f4d5c6a8b9e0d1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2",
      algorithm: "SHA-256",
      threatScore: 8.5,
      firstSeen: "2024-01-10",
      malwareFamily: "Cobalt Strike",
      detectionCount: 45,
    },
    ipReputation: {
      address: "185.234.72.45",
      threatScore: 9.2,
      country: "Russia",
      asn: "AS12345",
      tags: ["C2 Server", "Phishing", "Malware Distribution"],
    },
    relatedIncidents: [
      {
        id: "INC-098",
        title: "Similar C2 Communication Pattern",
        severity: "High",
        date: "2024-01-12",
      },
      {
        id: "INC-089",
        title: "Phishing Campaign - Same Infrastructure",
        severity: "Critical",
        date: "2024-01-08",
      },
      {
        id: "INC-076",
        title: "Cobalt Strike Beacon Detection",
        severity: "High",
        date: "2024-01-05",
      },
    ],
    externalReferences: [
      {
        name: "VirusTotal Analysis",
        icon: "fas fa-shield-virus",
        url: "https://www.virustotal.com/gui/file/a3c7b2e1f4d5c6a8b9e0d1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2",
      },
      {
        name: "MITRE ATT&CK Framework",
        icon: "fas fa-book",
        url: "https://attack.mitre.org/techniques/T1566/001/",
      },
      {
        name: "Threat Feed Report",
        icon: "fas fa-rss",
        url: "https://threatfeed.example.com/report/185.234.72.45",
      },
    ],
    relatedIndicators: ["185.234.72.45", "malware-c2.net"],
    recommendations: [
      "Isolate affected systems from network",
      "Run full antivirus scan",
      "Review access logs for anomalies",
      "Update security policies",
    ],
    evidence: [
      {
        id: "e1",
        type: "log",
        name: "system.log",
        timestamp: incident.dateCreated,
        size: "2.4 MB",
      },
      {
        id: "e2",
        type: "network",
        name: "traffic-capture.pcap",
        timestamp: incident.dateCreated,
        size: "15.8 MB",
      },
    ],
  };
};

export interface UseIncidentsDataReturn {
  data: IncidentsData | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  incidents: Incident[];
  filteredIncidents: Incident[];
  filter: IncidentsFilter;
  setFilter: (filter: Partial<IncidentsFilter>) => void;
  applyFilters: () => void;
  selectedIncident: IncidentDetail | null;
  selectIncident: (id: string | null) => Promise<void>;
  selectedIncidents: string[];
  toggleIncidentSelection: (id: string) => void;
  toggleAllIncidents: () => void;
  stats: IncidentsStats;
}

export const useIncidentsData = (): UseIncidentsDataReturn => {
  const [data, setData] = useState<IncidentsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [selectedIncident, setSelectedIncident] = useState<IncidentDetail | null>(null);
  const [selectedIncidents, setSelectedIncidents] = useState<string[]>([]);

  const [filter, setFilterState] = useState<IncidentsFilter>({
    severity: "all",
    status: "all",
    type: "all",
    dateFrom: "",
    dateTo: "",
    assignee: "",
    searchQuery: "",
  });

  const [appliedFilter, setAppliedFilter] = useState<IncidentsFilter>(filter);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const incidentsData = await fetchIncidentsData();
      setData(incidentsData);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch incidents data")
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter incidents based on applied filters
  const filteredIncidents =
    data?.incidents.filter((incident) => {
      // Severity filter
      if (appliedFilter.severity !== "all" && incident.severity !== appliedFilter.severity) {
        return false;
      }

      // Status filter
      if (appliedFilter.status !== "all" && incident.status !== appliedFilter.status) {
        return false;
      }

      // Type filter
      if (appliedFilter.type !== "all" && incident.type !== appliedFilter.type) {
        return false;
      }

      // Assignee filter
      if (appliedFilter.assignee && incident.assignee?.id !== appliedFilter.assignee) {
        return false;
      }

      // Search query filter
      if (appliedFilter.searchQuery) {
        const query = appliedFilter.searchQuery.toLowerCase();
        return (
          incident.incidentId.toLowerCase().includes(query) ||
          incident.title.toLowerCase().includes(query) ||
          incident.description.toLowerCase().includes(query) ||
          incident.aiSummary.toLowerCase().includes(query)
        );
      }

      return true;
    }) || [];

  const setFilter = (partialFilter: Partial<IncidentsFilter>) => {
    setFilterState((prev) => ({ ...prev, ...partialFilter }));
  };

  const applyFilters = () => {
    setAppliedFilter(filter);
  };

  const selectIncident = async (id: string | null) => {
    if (!id) {
      setSelectedIncident(null);
      return;
    }

    try {
      const detail = await fetchIncidentDetail(id);
      setSelectedIncident(detail);
    } catch (err) {
      console.error("Failed to fetch incident detail:", err);
    }
  };

  const toggleIncidentSelection = (id: string) => {
    setSelectedIncidents((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleAllIncidents = () => {
    if (selectedIncidents.length === filteredIncidents.length) {
      setSelectedIncidents([]);
    } else {
      setSelectedIncidents(filteredIncidents.map((i) => i.id));
    }
  };

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
    incidents: data?.incidents || [],
    filteredIncidents,
    filter,
    setFilter,
    applyFilters,
    selectedIncident,
    selectIncident,
    selectedIncidents,
    toggleIncidentSelection,
    toggleAllIncidents,
    stats: data?.stats || {
      total: 0,
      open: 0,
      investigating: 0,
      resolved: 0,
      closed: 0,
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
    },
  };
};
