import { Controller, Get, Param, UseGuards, Query } from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { AgentsService } from "./agents.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import {
  ApiOperationDecorator,
  UserReq,
} from "../../../../../libs/decorators/src";
import { User } from "../../../../../libs/entities";

export interface AgentQueryDto {
  status?: "online" | "offline" | "updating" | "all";
  siteId?: string;
}

@ApiTags("agents")
@ApiBearerAuth("JWT-auth")
@Controller("agents")
@UseGuards(JwtAuthGuard)
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) {}

  @Get()
  @ApiOperationDecorator({
    summary: "Get all agents",
    description: "Retrieve all agents with filtering options",
  })
  async findAll(@UserReq() user: User, @Query() query: AgentQueryDto) {
    return this.agentsService.findAll(user.id, query);
  }

  @Get("stats")
  @ApiOperationDecorator({
    summary: "Get agent statistics",
    description: "Retrieve agent stats and metrics for dashboard",
  })
  async getStats(@UserReq() user: User) {
    return this.agentsService.getStats(user.id);
  }

  @Get("os-distribution")
  @ApiOperationDecorator({
    summary: "Get OS distribution",
    description: "Retrieve operating system distribution statistics",
  })
  async getOSDistribution(@UserReq() user: User) {
    return this.agentsService.getOSDistribution(user.id);
  }

  @Get(":id")
  @ApiOperationDecorator({
    summary: "Get agent by ID",
    description: "Retrieve detailed information about a specific agent",
  })
  async findOne(@Param("id") id: string, @UserReq() user: User) {
    return this.agentsService.findOne(id, user.id);
  }

  @Get(":id/metrics")
  @ApiOperationDecorator({
    summary: "Get agent metrics",
    description: "Retrieve detailed metrics for a specific agent",
  })
  async getAgentMetrics(@Param("id") id: string, @UserReq() user: User) {
    return this.agentsService.getAgentMetrics(id, user.id);
  }
}
