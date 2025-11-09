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
} from "@nestjs/swagger";
import { ThreatsService } from "./threats.service";
import {
  CreateThreatIndicatorDto,
  UpdateThreatIndicatorDto,
  ThreatsFilterDto,
} from "./dto";
import { JwtAuthGuard } from "../../../libs/guards/src";
import { UserReq } from "../../../libs/decorators/src";
import { User } from "../../../libs/entities";
import { ApiOperationDecorator } from "../../../libs/decorators/src";

@ApiTags("threats")
@ApiBearerAuth("JWT-auth")
@UseGuards(JwtAuthGuard)
@Controller("threats")
export class ThreatsController {
  constructor(private readonly threatsService: ThreatsService) {}

  @Post()
  @ApiOperationDecorator({
    summary: "Create threat indicator",
    description: "Add a new threat indicator to the database",
  })
  @ApiResponse({
    status: 201,
    description: "Threat indicator created successfully",
  })
  async create(@Body() createThreatIndicatorDto: CreateThreatIndicatorDto) {
    return await this.threatsService.create(createThreatIndicatorDto);
  }

  @Get()
  @ApiOperationDecorator({
    summary: "Get all threat indicators",
    description: "Retrieve all threat indicators with optional filtering",
  })
  @ApiResponse({
    status: 200,
    description: "Threat indicators retrieved successfully",
  })
  async findAll(@Query() filter: ThreatsFilterDto) {
    return await this.threatsService.findAll(filter);
  }

  @Get("stats")
  @ApiOperationDecorator({
    summary: "Get threat statistics",
    description: "Get threat indicator counts by severity and status",
  })
  @ApiResponse({
    status: 200,
    description: "Statistics retrieved successfully",
  })
  async getStats() {
    return await this.threatsService.getStats();
  }

  @Get(":id")
  @ApiOperationDecorator({
    summary: "Get threat indicator by ID",
    description: "Retrieve detailed threat indicator information",
  })
  @ApiResponse({
    status: 200,
    description: "Threat indicator found",
  })
  @ApiResponse({
    status: 404,
    description: "Threat indicator not found",
  })
  async findOne(@Param("id") id: string) {
    return await this.threatsService.findOne(id);
  }

  @Patch(":id")
  @ApiOperationDecorator({
    summary: "Update threat indicator",
    description: "Update threat indicator information",
  })
  @ApiResponse({
    status: 200,
    description: "Threat indicator updated successfully",
  })
  @ApiResponse({
    status: 404,
    description: "Threat indicator not found",
  })
  async update(
    @Param("id") id: string,
    @Body() updateThreatIndicatorDto: UpdateThreatIndicatorDto
  ) {
    return await this.threatsService.update(id, updateThreatIndicatorDto);
  }

  @Delete(":id")
  @ApiOperationDecorator({
    summary: "Delete threat indicator",
    description: "Delete threat indicator by ID",
  })
  @ApiResponse({
    status: 204,
    description: "Threat indicator deleted successfully",
  })
  @ApiResponse({
    status: 404,
    description: "Threat indicator not found",
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param("id") id: string) {
    return await this.threatsService.remove(id);
  }

  @Post(":id/block")
  @ApiOperationDecorator({
    summary: "Block threat indicator",
    description: "Mark threat indicator as blocked",
  })
  @ApiResponse({
    status: 200,
    description: "Threat indicator blocked successfully",
  })
  async block(@Param("id") id: string) {
    return await this.threatsService.block(id);
  }

  @Post(":id/unblock")
  @ApiOperationDecorator({
    summary: "Unblock threat indicator",
    description: "Mark threat indicator as monitoring",
  })
  @ApiResponse({
    status: 200,
    description: "Threat indicator unblocked successfully",
  })
  async unblock(@Param("id") id: string) {
    return await this.threatsService.unblock(id);
  }

  @Post("bulk/block")
  @ApiOperationDecorator({
    summary: "Bulk block threat indicators",
    description: "Block multiple threat indicators",
  })
  @ApiResponse({
    status: 200,
    description: "Threat indicators blocked successfully",
  })
  async bulkBlock(@Body("ids") ids: string[]) {
    return await this.threatsService.bulkBlock(ids);
  }

  @Post("bulk/delete")
  @ApiOperationDecorator({
    summary: "Bulk delete threat indicators",
    description: "Delete multiple threat indicators",
  })
  @ApiResponse({
    status: 200,
    description: "Threat indicators deleted successfully",
  })
  async bulkDelete(@Body("ids") ids: string[]) {
    return await this.threatsService.bulkDelete(ids);
  }

  @Get("export/csv")
  @ApiOperationDecorator({
    summary: "Export threats to CSV",
    description: "Export all threat indicators to CSV format",
  })
  @ApiResponse({
    status: 200,
    description: "CSV export prepared",
  })
  async exportCsv(@Query() filter: ThreatsFilterDto) {
    const data = await this.threatsService.findAll(filter);
    return {
      message: "CSV export data prepared",
      data: data.indicators,
      filename: `threats_export_${new Date().toISOString().split("T")[0]}.csv`,
    };
  }

  @Get("enrichment/:indicator")
  @ApiOperationDecorator({
    summary: "Enrich threat indicator",
    description: "Get enrichment data for a specific indicator",
  })
  @ApiResponse({
    status: 200,
    description: "Enrichment data retrieved",
  })
  async enrichIndicator(@Param("indicator") indicator: string) {
    // This could integrate with external threat intelligence APIs
    return {
      indicator,
      enrichment: {
        reputation: "malicious",
        categories: ["malware", "c2"],
        firstSeen: new Date().toISOString(),
        lastSeen: new Date().toISOString(),
      },
      sources: ["VirusTotal", "AlienVault OTX", "Malware Bazaar"],
    };
  }
}
