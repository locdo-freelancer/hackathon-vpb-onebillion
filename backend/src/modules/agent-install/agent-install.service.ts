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
        download: `wget ${baseUrl}/downloads/securevault-agent-linux.sh`,
        install: `chmod +x securevault-agent-linux.sh`,
        configure: `./securevault-agent-linux.sh --token=${token} --server=${baseUrl}`,
        start: `systemctl start securevault-agent`,
        status: `systemctl status securevault-agent`,
      },
      windows: {
        download: `Invoke-WebRequest -Uri "${baseUrl}/downloads/securevault-agent-windows.exe" -OutFile "securevault-agent.exe"`,
        install: `./securevault-agent.exe /S`,
        configure: `securevault-agent.exe --token=${token} --server=${baseUrl}`,
        start: `Start-Service SecureVaultAgent`,
        status: `Get-Service SecureVaultAgent`,
      },
      docker: {
        pull: `docker pull securevault/agent:latest`,
        run: `docker run -d --name securevault-agent \\
  -e TOKEN=${token} \\
  -e SERVER_URL=${baseUrl} \\
  --restart unless-stopped \\
  securevault/agent:latest`,
        status: `docker ps | grep securevault-agent`,
      },
    };

    return {
      platform,
      commands: commands[platform] || commands.linux,
      downloadUrl: `${baseUrl}/downloads/securevault-agent-${platform}`,
    };
  }

  async checkInstallStatus(userId: string) {
    const sites = await this.siteRepository.find({
      where: { user_id: userId },
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
}
