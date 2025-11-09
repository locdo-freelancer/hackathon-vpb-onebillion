import {
  Controller,
  Post,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { AgentCommService } from "./agent-comm.service";
import { AgentAuthGuard } from "./guards/agent-auth.guard";
import { Public, ApiOperationDecorator } from "../../../libs/decorators/src";

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
}
