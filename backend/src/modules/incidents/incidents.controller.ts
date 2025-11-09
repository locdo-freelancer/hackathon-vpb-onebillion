import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from "@nestjs/swagger";
import { IncidentsService } from "./incidents.service";
import {
  CreateIncidentDto,
  UpdateIncidentDto,
  IncidentsFilterDto,
  BulkActionDto,
} from "./dto";
import { JwtAuthGuard } from "../../../libs/guards/src";
import { UserReq } from "../../../libs/decorators/src";
import { User } from "../../../libs/entities";
import { ApiOperationDecorator } from "../../../libs/decorators/src";

@ApiTags("incidents")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("incidents")
export class IncidentsController {
  constructor(private readonly incidentsService: IncidentsService) {}

  @Post()
  @ApiOperationDecorator({
    summary: "Create new incident",
    description: "Create a new security incident",
  })
  @ApiResponse({
    status: 201,
    description: "Incident created successfully",
  })
  async create(
    @Body() createIncidentDto: CreateIncidentDto,
    @UserReq() user: User
  ) {
    return await this.incidentsService.create(createIncidentDto, user.id);
  }

  @Get()
  @ApiOperationDecorator({
    summary: "Get all incidents",
    description: "Retrieve all security incidents with optional filtering",
  })
  @ApiResponse({
    status: 200,
    description: "Incidents retrieved successfully",
  })
  async findAll(@Query() filter: IncidentsFilterDto, @UserReq() user: User) {
    return await this.incidentsService.findAll(filter, user.id);
  }

  @Get("stats")
  @ApiOperationDecorator({
    summary: "Get incidents statistics",
    description: "Get incident counts by status and severity",
  })
  @ApiResponse({
    status: 200,
    description: "Statistics retrieved successfully",
  })
  async getStats(@UserReq() user: User) {
    return await this.incidentsService.getStats(user.id);
  }

  @Get(":id")
  @ApiOperationDecorator({
    summary: "Get incident by ID",
    description: "Retrieve detailed incident information",
  })
  @ApiResponse({
    status: 200,
    description: "Incident found",
  })
  @ApiResponse({
    status: 404,
    description: "Incident not found",
  })
  async findOne(@Param("id") id: string) {
    return await this.incidentsService.findOne(id);
  }

  @Get("incident/:incidentId")
  @ApiOperationDecorator({
    summary: "Get incident by incident ID",
    description: "Retrieve incident by display ID (e.g., INC-001)",
  })
  @ApiResponse({
    status: 200,
    description: "Incident found",
  })
  @ApiResponse({
    status: 404,
    description: "Incident not found",
  })
  async findByIncidentId(@Param("incidentId") incidentId: string) {
    return await this.incidentsService.findByIncidentId(incidentId);
  }

  @Patch(":id")
  @ApiOperationDecorator({
    summary: "Update incident",
    description: "Update incident information",
  })
  @ApiResponse({
    status: 200,
    description: "Incident updated successfully",
  })
  @ApiResponse({
    status: 404,
    description: "Incident not found",
  })
  async update(
    @Param("id") id: string,
    @Body() updateIncidentDto: UpdateIncidentDto
  ) {
    return await this.incidentsService.update(id, updateIncidentDto);
  }

  @Delete(":id")
  @ApiOperationDecorator({
    summary: "Delete incident",
    description: "Delete incident by ID",
  })
  @ApiResponse({
    status: 204,
    description: "Incident deleted successfully",
  })
  @ApiResponse({
    status: 404,
    description: "Incident not found",
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param("id") id: string) {
    return await this.incidentsService.remove(id);
  }

  @Post("bulk-action")
  @ApiOperationDecorator({
    summary: "Bulk action on incidents",
    description:
      "Perform bulk actions (close, assign, export) on multiple incidents",
  })
  @ApiResponse({
    status: 200,
    description: "Bulk action completed successfully",
  })
  async bulkAction(
    @Body("incidentIds") incidentIds: string[],
    @Body() action: BulkActionDto
  ) {
    return await this.incidentsService.bulkAction(incidentIds, action);
  }

  @Post(":id/resolve")
  @ApiOperationDecorator({
    summary: "Resolve incident",
    description: "Mark incident as resolved",
  })
  @ApiResponse({
    status: 200,
    description: "Incident resolved successfully",
  })
  async resolve(@Param("id") id: string) {
    return await this.incidentsService.update(id, {
      status: "resolved" as any,
    });
  }

  @Post(":id/close")
  @ApiOperationDecorator({
    summary: "Close incident",
    description: "Mark incident as closed",
  })
  @ApiResponse({
    status: 200,
    description: "Incident closed successfully",
  })
  async close(@Param("id") id: string) {
    return await this.incidentsService.update(id, { status: "closed" as any });
  }

  @Post(":id/assign")
  @ApiOperationDecorator({
    summary: "Assign incident",
    description: "Assign incident to a user",
  })
  @ApiResponse({
    status: 200,
    description: "Incident assigned successfully",
  })
  async assign(
    @Param("id") id: string,
    @Body("assigneeId") assigneeId: string
  ) {
    return await this.incidentsService.update(id, { assignee_id: assigneeId });
  }
}
