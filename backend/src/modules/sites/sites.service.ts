import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { CreateSiteDto } from "./dto/create-site.dto";
import { UpdateSiteDto } from "./dto/update-site.dto";
import * as crypto from "crypto";
import { AgentEntity, Site, User, SiteStatus } from "../../../libs/entities";

@Injectable()
export class SitesService {
  constructor(
    @InjectRepository(Site)
    private siteRepository: Repository<Site>,
    @InjectRepository(AgentEntity)
    private agentRepository: Repository<AgentEntity>,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async create(dto: CreateSiteDto, userId: string) {
    const now = Date.now();
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException("User not found");
    }

    // Generate cryptographically secure agent token
    const agentToken = crypto.randomBytes(32).toString("hex");

    const site = this.siteRepository.create({
      user,
      name: dto.name,
      ip_address: dto.ip_address,
      domain_name: dto.domain_name,
      server_type: dto.server_type,
      status: SiteStatus.PENDING,
      entity_token: agentToken,
    });

    await this.siteRepository.save(site);

    // Create associated Agent record
    const agent = this.agentRepository.create({
      site_id: site.id,
      is_connected: 0,
      last_checkin: 0,
    });

    await this.agentRepository.save(agent);

    return {
      ...site,
      agent_token: agentToken, // Return token only on creation
    };
  }

  async findAll(userId: string) {
    const sites = await this.siteRepository.find({
      where: { user: { id: userId } },
      relations: ["agent"],
      order: { createdAt: "DESC" },
    });

    // Format for frontend compatibility
    return {
      sites: sites.map((site) => ({
        id: site.id,
        name: site.name,
        hostname: site.name, // Use name as hostname for now
        ipAddress: site.ip_address,
        domains: site.domain_name ? [site.domain_name] : [],
        agentCount: site.agent ? 1 : 0,
        status: this.mapStatus(site.status),
        icon: this.getIcon(site.server_type),
        iconGradient: this.getIconGradient(site.server_type),
        lastChecked: this.formatLastChecked(site.updatedAt),
      })),
      totalSites: sites.length,
      activeSites: sites.filter((s) => s.status === SiteStatus.CONNECTED)
        .length,
      inactiveSites: sites.filter((s) => s.status === SiteStatus.DISCONNECTED)
        .length,
      warningSites: sites.filter((s) => s.status === SiteStatus.WARNING).length,
    };
  }

  private mapStatus(status: SiteStatus): "active" | "inactive" | "warning" {
    switch (status) {
      case SiteStatus.CONNECTED:
        return "active";
      case SiteStatus.DISCONNECTED:
      case SiteStatus.INACTIVE:
      case SiteStatus.OFFLINE:
        return "inactive";
      case SiteStatus.WARNING:
        return "warning";
      default:
        return "inactive";
    }
  }

  private getIcon(serverType: string): string {
    switch (serverType?.toLowerCase()) {
      case "web":
        return "fas fa-globe";
      case "database":
        return "fas fa-database";
      case "api":
        return "fas fa-code";
      case "storage":
        return "fas fa-cloud";
      case "mail":
        return "fas fa-envelope";
      default:
        return "fas fa-server";
    }
  }

  private getIconGradient(serverType: string): string {
    switch (serverType?.toLowerCase()) {
      case "web":
        return "from-cyan-500 to-cyan-600";
      case "database":
        return "from-purple-500 to-pink-500";
      case "api":
        return "from-yellow-500 to-orange-500";
      case "storage":
        return "from-blue-500 to-indigo-500";
      case "mail":
        return "from-red-500 to-pink-500";
      default:
        return "from-gray-500 to-gray-600";
    }
  }

  private formatLastChecked(timestamp: Date): string {
    if (!timestamp) return "Never";

    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();

    if (diff < 60000) return `${Math.floor(diff / 1000)} seconds ago`;
    if (diff < 3600000) return `${Math.floor(diff / 60000)} minutes ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;
    return `${Math.floor(diff / 86400000)} days ago`;
  }

  async findOne(id: string, userId: string) {
    const site = await this.siteRepository.findOne({
      where: { id },
      relations: ["agent", "user"],
    });

    if (!site) {
      throw new NotFoundException("Site not found");
    }

    if (site.user.id !== userId) {
      throw new ForbiddenException("You do not have access to this site");
    }

    const { entity_token, ...result } = site;
    return result;
  }

  async update(id: string, userId: string, dto: UpdateSiteDto) {
    const site = await this.findOne(id, userId);

    const updated = await this.siteRepository.save({
      ...site,
      ...dto,
    });

    const { entity_token, ...result } = updated;
    return result;
  }

  async remove(id: string, userId: string) {
    const site = await this.findOne(id, userId);

    await this.siteRepository.remove(site as Site);

    return { message: "Site deleted successfully" };
  }
}
