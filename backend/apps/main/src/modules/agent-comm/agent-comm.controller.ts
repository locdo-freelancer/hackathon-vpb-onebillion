import {
  Controller,
  Post,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  Body,
} from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { AgentCommService } from "./agent-comm.service";
import { AgentAuthGuard } from "./guards/agent-auth.guard";
import {
  Public,
  ApiOperationDecorator,
} from "../../../../../libs/decorators/src";
import { ReportThreatDto } from "@/modules/agent-comm/dto/report-threat.dto";

@ApiTags("agent")
@ApiBearerAuth("Agent-Token")
@Controller("agent")
export class AgentCommController {
  constructor(private readonly agentCommService: AgentCommService) {}

  @Public()
  @Post("check-in")
  @UseGuards(AgentAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperationDecorator({
    summary: "Agent check-in",
    description:
      "Agent heartbeat endpoint to report status and update last check-in time",
  })
  async checkIn(@Request() req) {
    return this.agentCommService.handleCheckIn(req.user);
  }

  @Public()
  @Post("report-threat")
  @UseGuards(AgentAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperationDecorator({
    summary: "Report threat from agent",
    description:
      "Agent reports detected threat indicators (IPs, domains, malware, etc.)",
  })
  async reportThreat(@Request() req, @Body() reportThreatDto: ReportThreatDto) {
    return this.agentCommService.handleReportThreat(req.user, reportThreatDto);
  }
}
