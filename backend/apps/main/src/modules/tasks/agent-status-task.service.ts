import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { AgentEntity, Site, SiteStatus } from "@lib/entities";
import { Repository, LessThan } from "typeorm";

@Injectable()
export class AgentStatusTaskService {
  private readonly logger = new Logger(AgentStatusTaskService.name);
  private readonly STALE_THRESHOLD_MS = 10 * 60 * 1000; // 10 minutes

  constructor(
    @InjectRepository(AgentEntity)
    private agentRepository: Repository<AgentEntity>,
    @InjectRepository(Site)
    private siteRepository: Repository<Site>
  ) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleCron() {
    this.logger.log("Running agent status check...");

    const now = Date.now();
    const staleThreshold = now - this.STALE_THRESHOLD_MS;

    try {
      // Find all agents that are marked as connected but haven't checked in recently
      const staleAgents = await this.agentRepository
        .createQueryBuilder("agent")
        .leftJoinAndSelect("agent.site", "site")
        .where("agent.is_connected = :connected", { connected: 1 })
        .andWhere("agent.last_checkin < :threshold", {
          threshold: staleThreshold,
        })
        .getMany();

      this.logger.log(`Found ${staleAgents.length} stale agent(s)`);

      for (const agent of staleAgents) {
        // Mark agent as disconnected
        await this.agentRepository.update(agent.id, {
          is_connected: 0,
        });

        // Update site status to Disconnected
        if (agent.site) {
          await this.siteRepository.update(agent.site.id, {
            status: SiteStatus.DISCONNECTED,
          });

          this.logger.log(
            `Marked agent ${agent.id} and site ${agent.site.id} as disconnected`
          );
        }
      }

      this.logger.log("Agent status check completed");
    } catch (error) {
      this.logger.error("Error during agent status check", error.stack);
    }
  }
}
