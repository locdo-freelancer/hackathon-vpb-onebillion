import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AgentEntity, Site } from "../../../libs/entities";

@Injectable()
export class AgentInstallService {
  constructor(
    @InjectRepository(AgentEntity)
    private agentRepository: Repository<AgentEntity>,
    @InjectRepository(Site)
    private siteRepository: Repository<Site>
  ) {}

  async getInstallCommands(platform: string, token: string) {
    const baseUrl = process.env.API_URL || "http://localhost:3001";

    const commands = {
      linux: {
        download: `# Download SecureVault Agent\ncurl -sSL ${baseUrl}/api/downloads/agent/linux -o agent.py`,
        install: `# Make it executable (optional)\nchmod +x agent.py`,
        configure: `# Run agent with your token\npython3 agent.py --server ${baseUrl} --token ${token}`,
        start: `# Run in background:\nnohup python3 agent.py --server ${baseUrl} --token ${token} > agent.log 2>&1 &`,
        status: `# Check if agent is running\nps aux | grep agent.py\n# Or check logs:\ntail -f agent.log`,
      },
      windows: {
        download: `# Download SecureVault Agent\nInvoke-WebRequest -Uri "${baseUrl}/api/downloads/agent/windows" -OutFile "agent.py"`,
        install: `# Ensure Python 3 is installed\n# Download from: https://www.python.org/downloads/`,
        configure: `# Run agent with your token\npython agent.py --server ${baseUrl} --token ${token}`,
        start: `# Run in background (PowerShell):\nStart-Process python -ArgumentList "agent.py --server ${baseUrl} --token ${token}" -WindowStyle Hidden`,
        status: `# Check if agent is running\nGet-Process python | Where-Object {$_.CommandLine -like "*agent.py*"}`,
      },
      macos: {
        download: `# Download SecureVault Agent\ncurl -sSL ${baseUrl}/api/downloads/agent/macos -o agent.py`,
        install: `# Make it executable (optional)\nchmod +x agent.py`,
        configure: `# Run agent with your token\npython3 agent.py --server ${baseUrl} --token ${token}`,
        start: `# Run in background:\nnohup python3 agent.py --server ${baseUrl} --token ${token} > agent.log 2>&1 &`,
        status: `# Check if agent is running\nps aux | grep agent.py\n# Or check logs:\ntail -f agent.log`,
      },
      docker: {
        pull: `# Download agent script\ncurl -sSL ${baseUrl}/api/downloads/agent/docker -o agent.py`,
        run: `# Run agent in Docker container\ndocker run -d --name securevault-agent \\\n  -v $(pwd)/agent.py:/app/agent.py \\\n  python:3.11-slim \\\n  python /app/agent.py --server ${baseUrl} --token ${token}`,
        status: `# Check agent container\ndocker logs securevault-agent\n# Or check if running:\ndocker ps | grep securevault-agent`,
      },
    };

    return {
      platform,
      commands: commands[platform] || commands.linux,
      downloadUrl: `${baseUrl}/api/downloads/agent/${platform}`,
    };
  }

  async checkInstallStatus(userId: string) {
    const sites = await this.siteRepository.find({
      where: { user: { id: userId } },
      relations: ["agent"],
    });

    const connectedAgents = sites.filter(
      (site) => site.agent && site.agent.is_connected === 1
    );

    return {
      totalSites: sites.length,
      connectedAgents: connectedAgents.length,
      isRegistered: connectedAgents.length > 0,
      agents: connectedAgents.map((site) => ({
        id: site.agent.id,
        siteName: site.name,
        lastHeartbeat: site.agent.last_checkin,
        version: site.agent.agent_version,
        osInfo: site.agent.os_info,
      })),
    };
  }

  /**
   * Handle heartbeat from real agent
   * Updates agent connection status and metrics
   */
  async handleAgentHeartbeat(dto: any) {
    try {
      // Find site by token
      const site = await this.siteRepository.findOne({
        where: { entity_token: dto.token },
        relations: ["agent"],
      });

      if (!site) {
        return {
          success: false,
          message: "Invalid token",
        };
      }

      if (!site.agent) {
        // Create new agent for this site
        const newAgent = this.agentRepository.create({
          site_id: site.id,
          is_connected: 1,
          agent_version: dto.version,
          os_info: dto.osInfo,
          last_checkin: Date.now(),
        });

        const savedAgent = await this.agentRepository.save(newAgent);

        return {
          success: true,
          message: "Agent registered successfully",
          agentId: savedAgent.id,
        };
      }

      // Update existing agent
      site.agent.is_connected = 1;
      site.agent.last_checkin = Date.now();
      site.agent.agent_version = dto.version;
      site.agent.os_info = dto.osInfo;

      await this.agentRepository.save(site.agent);

      return {
        success: true,
        message: "Heartbeat received",
        agentId: site.agent.id,
        metrics: {
          cpuUsage: dto.cpuUsage,
          memoryUsage: dto.memoryUsage,
          diskUsage: dto.diskUsage,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: "Failed to process heartbeat",
        error: error.message,
      };
    }
  }
}
