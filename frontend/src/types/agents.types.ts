// Agents Management Types - Single Responsibility Principle
// Aligned with Backend API responses

export type AgentStatus = "online" | "offline" | "updating";
export type OSType = "linux" | "windows" | "docker" | "macos"; // Added "docker" to match BE

export interface Agent {
  id: string;
  hostname: string;
  ipAddress: string;
  os: string;
  osType: OSType;
  osIcon: string;
  version: string;
  status: AgentStatus;
  lastHeartbeat: string; // Formatted time ago from BE
  cpuUsage?: number;
  memoryUsage?: number;
  updateProgress?: number;
  iconGradient: string;
  siteId: string; // Required from BE
  siteName: string; // Required from BE
  createdAt?: number;
  updatedAt?: number;
}

export interface AgentStats {
  total: number;
  online: number;
  offline: number;
  updating: number;
}

export interface AgentMetrics {
  avgResponseTime: string;
  dataTransferred: string;
  threatsBlocked: number;
  updatesAvailable: number;
}

export interface OSDistribution {
  os: string;
  count: number;
  color: string;
}

export interface AgentsData {
  agents: Agent[];
  stats: AgentStats;
  metrics: AgentMetrics;
  osDistribution: OSDistribution[];
}

export interface AgentDetailInfo {
  agent: Agent;
  uptime: string;
  totalScans: number;
  lastScan: string;
  detectedThreats: number;
  memoryUsage: number;
  diskUsage: number;
  networkIn: string;
  networkOut: string;
}
