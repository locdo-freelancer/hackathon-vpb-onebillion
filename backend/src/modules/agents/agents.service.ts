import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AgentEntity, Site } from "../../../libs/entities";

export interface AgentQueryDto {
  status?: "online" | "offline" | "updating" | "all";
  siteId?: string;
}

@Injectable()
export class AgentsService {
  constructor(
    @InjectRepository(AgentEntity)
    private agentRepository: Repository<AgentEntity>,
    @InjectRepository(Site)
    private siteRepository: Repository<Site>
  ) {}

  async findAll(userId: string, query: AgentQueryDto) {
    const queryBuilder = this.agentRepository
      .createQueryBuilder("agent")
      .leftJoinAndSelect("agent.site", "site")
      .leftJoinAndSelect("site.user", "user")
      .where("user.id = :userId", { userId });

    if (query.status && query.status !== "all") {
      if (query.status === "online") {
        queryBuilder.andWhere("agent.is_connected = 1");
      } else if (query.status === "offline") {
        queryBuilder.andWhere("agent.is_connected = 0");
      }
    }

    if (query.siteId) {
      queryBuilder.andWhere("site.id = :siteId", {
        siteId: query.siteId,
      });
    }

    const agents = await queryBuilder.getMany();

    return agents.map((agent) => ({
      id: agent.id,
      hostname: agent.site?.name || "Unknown",
      ipAddress: agent.site?.ip_address || "N/A",
      os: agent.os_info || "Unknown OS",
      osType: this.getOSType(agent.os_info),
      osIcon: this.getOSIcon(agent.os_info),
      version: agent.agent_version || "Unknown",
      status: agent.is_connected ? "online" : "offline",
      lastHeartbeat: this.formatLastHeartbeat(agent.last_checkin),
      siteId: agent.site_id,
      siteName: agent.site?.name,
      iconGradient: this.getIconGradient(agent.os_info),
    }));
  }

  async getStats(userId: string) {
    const agents = await this.agentRepository
      .createQueryBuilder("agent")
      .leftJoinAndSelect("agent.site", "site")
      .leftJoinAndSelect("site.user", "user")
      .where("user.id = :userId", { userId })
      .getMany();

    const total = agents.length;
    const online = agents.filter((a) => a.is_connected === 1).length;
    const offline = agents.filter((a) => a.is_connected === 0).length;

    // Count agents by OS type
    const byOS = agents.reduce(
      (acc, agent) => {
        const osType = this.getOSType(agent.os_info);
        acc[osType] = (acc[osType] || 0) + 1;
        return acc;
      },
      { linux: 0, windows: 0, docker: 0, macos: 0 } as Record<string, number>
    );

    return {
      totalAgents: total,
      onlineAgents: online,
      offlineAgents: offline,
      updatingAgents: 0,
      byOS,
    };
  }

  async getOSDistribution(userId: string) {
    const agents = await this.agentRepository
      .createQueryBuilder("agent")
      .leftJoinAndSelect("agent.site", "site")
      .leftJoinAndSelect("site.user", "user")
      .where("user.id = :userId", { userId })
      .getMany();

    const osCount = agents.reduce(
      (acc, agent) => {
        const osType = this.getOSType(agent.os_info);
        acc[osType] = (acc[osType] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return Object.entries(osCount).map(([os, count]) => ({
      os: os.charAt(0).toUpperCase() + os.slice(1),
      count,
      color: this.getOSColor(os),
    }));
  }

  async findOne(id: string, userId: string) {
    const agent = await this.agentRepository
      .createQueryBuilder("agent")
      .leftJoinAndSelect("agent.site", "site")
      .leftJoinAndSelect("site.user", "user")
      .where("agent.id = :id", { id })
      .andWhere("user.id = :userId", { userId })
      .getOne();

    if (!agent) {
      throw new NotFoundException("Agent not found");
    }

    return {
      id: agent.id,
      hostname: agent.site?.name || "Unknown",
      ipAddress: agent.site?.ip_address || "N/A",
      os: agent.os_info || "Unknown OS",
      osType: this.getOSType(agent.os_info),
      osIcon: this.getOSIcon(agent.os_info),
      version: agent.agent_version || "Unknown",
      status: agent.is_connected ? "online" : "offline",
      lastHeartbeat: this.formatLastHeartbeat(agent.last_checkin),
      siteId: agent.site_id,
      siteName: agent.site?.name,
      iconGradient: this.getIconGradient(agent.os_info),
    };
  }

  async getAgentMetrics(id: string, userId: string) {
    const agent = await this.findOne(id, userId);

    return {
      uptime: "15d 4h 32m",
      totalScans: 1247,
      lastScan: "2 minutes ago",
      detectedThreats: 12,
      memoryUsage: 245,
      diskUsage: 12.5,
      networkIn: "1.2 GB",
      networkOut: "856 MB",
      cpuUsage: Math.floor(Math.random() * 50) + 10,
    };
  }

  private getOSType(osInfo: string): string {
    if (!osInfo) return "other";
    const os = osInfo.toLowerCase();
    if (os.includes("windows")) return "windows";
    if (
      os.includes("linux") ||
      os.includes("ubuntu") ||
      os.includes("centos") ||
      os.includes("rhel")
    )
      return "linux";
    if (os.includes("mac") || os.includes("darwin")) return "macos";
    return "other";
  }

  private getOSIcon(osInfo: string): string {
    const osType = this.getOSType(osInfo);
    switch (osType) {
      case "windows":
        return "fab fa-windows";
      case "linux":
        return "fab fa-linux";
      case "macos":
        return "fab fa-apple";
      default:
        return "fas fa-server";
    }
  }

  private getIconGradient(osInfo: string): string {
    const osType = this.getOSType(osInfo);
    switch (osType) {
      case "windows":
        return "from-blue-500 to-cyan-500";
      case "linux":
        return "from-green-500 to-emerald-500";
      case "macos":
        return "from-purple-500 to-indigo-500";
      default:
        return "from-gray-500 to-gray-600";
    }
  }

  private getOSColor(osType: string): string {
    switch (osType) {
      case "linux":
        return "#10b981";
      case "windows":
        return "#3b82f6";
      case "macos":
        return "#a855f7";
      default:
        return "#6b7280";
    }
  }

  private formatLastHeartbeat(timestamp: number): string {
    if (!timestamp) return "Never";

    const now = Date.now();
    const diff = now - timestamp;

    if (diff < 60000) return `${Math.floor(diff / 1000)}s ago`;
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  }
}
