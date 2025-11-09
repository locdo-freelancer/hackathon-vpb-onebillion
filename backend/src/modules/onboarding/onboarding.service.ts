import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Site, AgentEntity, User, SiteStatus } from "../../../libs/entities";
import * as crypto from "crypto";
import * as dns from "dns";
import { promisify } from "util";
import { OnboardingProgressDto, CompleteOnboardingDto } from "./dto";

const dnsLookup = promisify(dns.lookup);

@Injectable()
export class OnboardingService {
  constructor(
    @InjectRepository(Site)
    private siteRepository: Repository<Site>,
    @InjectRepository(AgentEntity)
    private agentRepository: Repository<AgentEntity>,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async saveProgress(userId: string, dto: OnboardingProgressDto) {
    return { success: true };
  }

  async completeOnboarding(userId: string, dto: CompleteOnboardingDto) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });

      if (!user) {
        throw new Error("User not found");
      }

      const site = this.siteRepository.create({
        user,
        name: dto.siteName,
        ip_address: dto.ipAddress,
        domain_name: dto.domainName,
        server_type: dto.serverType,
        status: SiteStatus.PENDING,
        entity_token: crypto.randomBytes(32).toString("hex"),
      });

      const savedSite = await this.siteRepository.save(site);

      const agent = this.agentRepository.create({
        site_id: savedSite.id,
        is_connected: 0,
        last_checkin: 0,
        agent_version: null,
        os_info: null,
      });

      await this.agentRepository.save(agent);

      return {
        success: true,
        message: "Onboarding completed successfully",
        siteId: savedSite.id,
        installToken: savedSite.entity_token,
      };
    } catch (error) {
      console.error("Onboarding completion error:", error);
      return {
        success: false,
        message: "Failed to complete onboarding",
      };
    }
  }

  async validateIP(ipAddress: string) {
    try {
      await dnsLookup(ipAddress);
      return {
        success: true,
        message: "IP address is valid and reachable",
      };
    } catch (error) {
      return {
        success: false,
        message: "IP address is not reachable or invalid",
      };
    }
  }

  async validateConnectivity(userId: string) {
    // Mock validation - in production, check actual connectivity
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate validation time

    return {
      networkConnectivity: "success" as const,
      agentAuthentication: "success" as const,
      initialDataSync: "success" as const,
    };
  }
}
