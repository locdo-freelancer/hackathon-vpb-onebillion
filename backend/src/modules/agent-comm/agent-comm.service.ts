import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AgentEntity, Site, SiteStatus } from "../../../libs/entities";
import { Repository } from "typeorm";

@Injectable()
export class AgentCommService {
  constructor(
    @InjectRepository(AgentEntity)
    private agentRepository: Repository<AgentEntity>,
    @InjectRepository(Site)
    private siteRepository: Repository<Site>
  ) {}

  async handleCheckIn(site: Site) {
    const now = Date.now();

    // Update agent record
    await this.agentRepository.update(
      { site_id: site.id },
      {
        last_checkin: now,
        is_connected: 1,
      }
    );

    // Update site status
    await this.siteRepository.update(site.id, {
      status: SiteStatus.CONNECTED,
    });

    return {
      success: true,
      message: "Check-in successful",
      timestamp: now,
    };
  }
}
