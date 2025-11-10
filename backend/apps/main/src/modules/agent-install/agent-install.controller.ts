import {
  Controller,
  Get,
  Param,
  UseGuards,
  Query,
  Post,
  Body,
} from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { AgentInstallService } from "./agent-install.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ApiOperationDecorator, UserReq, Public } from "@lib/decorators";
import { User } from "@lib/entities";
import { AgentHeartbeatDto } from "./dto";

@ApiTags("agent-install")
@ApiBearerAuth("JWT-auth")
@Controller("agent-install")
@UseGuards(JwtAuthGuard)
export class AgentInstallController {
  constructor(private readonly agentInstallService: AgentInstallService) {}

  @Get("commands/:platform")
  @ApiOperationDecorator({
    summary: "Get installation commands",
    description: "Get platform-specific agent installation commands",
  })
  async getInstallCommands(
    @Param("platform") platform: string,
    @Query("token") token: string,
    @UserReq() user: User
  ) {
    return this.agentInstallService.getInstallCommands(platform, token);
  }

  @Get("status")
  @ApiOperationDecorator({
    summary: "Check installation status",
    description: "Check if agent is successfully installed and connected",
  })
  async checkInstallStatus(@UserReq() user: User) {
    return this.agentInstallService.checkInstallStatus(user.id);
  }

  @Post("heartbeat")
  @Public()
  @ApiOperationDecorator({
    summary: "Agent heartbeat (Real Agent)",
    description: "Receive heartbeat from real agent with system metrics",
  })
  async agentHeartbeat(@Body() dto: AgentHeartbeatDto) {
    return this.agentInstallService.handleAgentHeartbeat(dto);
  }
}
