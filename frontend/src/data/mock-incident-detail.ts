import { IncidentDetail } from "@/types/incidents.types";
import { fetchIncidentsData } from "./mock-incident";

// Mock incident detail fetcher
export const fetchIncidentDetail = async (id: string): Promise<IncidentDetail> => {
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