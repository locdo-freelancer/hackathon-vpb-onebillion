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
  HttpStatus,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../../../libs/guards/src";
import { RemediationActionsService } from "./remediation-actions.service";
import {
  CreateRemediationActionDto,
  UpdateRemediationActionDto,
  RemediationActionsFilterDto,
} from "./dto";
import { RemediationStatus } from "../../../libs/entities/src/remediation-action.entity";

@ApiTags("Remediation Actions")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("remediation-actions")
export class RemediationActionsController {
  constructor(
    private readonly remediationActionsService: RemediationActionsService
  ) {}

  @Post()
  @ApiOperation({
    summary: "Create a new remediation action",
    description:
      "Creates a new remediation action for incidents, threats, or vulnerabilities",
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Remediation action created successfully",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Invalid input data",
  })
  async create(@Body() createDto: CreateRemediationActionDto) {
    const remediationAction =
      await this.remediationActionsService.create(createDto);

    return {
      success: true,
      message: "Remediation action created successfully",
      data: remediationAction,
    };
  }

  @Get()
  @ApiOperation({
    summary: "Get all remediation actions with filtering",
    description:
      "Retrieves a paginated list of remediation actions with optional filtering",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Remediation actions retrieved successfully",
  })
  async findAll(@Query() filters: RemediationActionsFilterDto) {
    const result = await this.remediationActionsService.findAll(filters);

    return {
      success: true,
      message: "Remediation actions retrieved successfully",
      data: result.data,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    };
  }

  @Get("statistics")
  @ApiOperation({
    summary: "Get remediation actions statistics",
    description: "Retrieves comprehensive statistics about remediation actions",
  })
  @ApiQuery({
    name: "site_id",
    required: false,
    description: "Filter statistics by site ID",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Statistics retrieved successfully",
  })
  async getStatistics(@Query("site_id") siteId?: string) {
    const statistics =
      await this.remediationActionsService.getStatistics(siteId);

    return {
      success: true,
      message: "Statistics retrieved successfully",
      data: statistics,
    };
  }

  @Get("by-source/:sourceType/:sourceId")
  @ApiOperation({
    summary: "Get remediation actions by source",
    description:
      "Retrieves remediation actions associated with a specific incident, threat, or vulnerability",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Remediation actions retrieved successfully",
  })
  async getActionsBySource(
    @Param("sourceType") sourceType: "incident" | "threat" | "vulnerability",
    @Param("sourceId") sourceId: string
  ) {
    const actions = await this.remediationActionsService.getActionsBySource(
      sourceType,
      sourceId
    );

    return {
      success: true,
      message: "Remediation actions retrieved successfully",
      data: actions,
    };
  }

  @Get(":id")
  @ApiOperation({
    summary: "Get a specific remediation action",
    description:
      "Retrieves detailed information about a specific remediation action",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Remediation action retrieved successfully",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Remediation action not found",
  })
  async findOne(@Param("id") id: string) {
    const remediationAction = await this.remediationActionsService.findOne(id);

    return {
      success: true,
      message: "Remediation action retrieved successfully",
      data: remediationAction,
    };
  }

  @Patch(":id")
  @ApiOperation({
    summary: "Update a remediation action",
    description: "Updates an existing remediation action with new information",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Remediation action updated successfully",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Remediation action not found",
  })
  async update(
    @Param("id") id: string,
    @Body() updateDto: UpdateRemediationActionDto
  ) {
    const remediationAction = await this.remediationActionsService.update(
      id,
      updateDto
    );

    return {
      success: true,
      message: "Remediation action updated successfully",
      data: remediationAction,
    };
  }

  @Patch("bulk/status")
  @ApiOperation({
    summary: "Bulk update remediation action status",
    description: "Updates the status of multiple remediation actions at once",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Bulk status update completed",
  })
  async bulkUpdateStatus(
    @Body() body: { ids: string[]; status: RemediationStatus }
  ) {
    const result = await this.remediationActionsService.bulkUpdateStatus(
      body.ids,
      body.status
    );

    return {
      success: true,
      message: `Bulk update completed. ${result.updated} actions updated.`,
      data: {
        updated: result.updated,
        errors: result.errors,
      },
    };
  }

  @Delete(":id")
  @ApiOperation({
    summary: "Delete a remediation action",
    description: "Deletes a specific remediation action permanently",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Remediation action deleted successfully",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Remediation action not found",
  })
  async remove(@Param("id") id: string) {
    await this.remediationActionsService.remove(id);

    return {
      success: true,
      message: "Remediation action deleted successfully",
    };
  }
}
