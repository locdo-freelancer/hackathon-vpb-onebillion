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
import { VulnerabilitiesService } from "./vulnerabilities.service";
import {
  CreateVulnerabilityDto,
  CreateSiteVulnerabilityDto,
  UpdateVulnerabilityDto,
  UpdateSiteVulnerabilityDto,
  VulnerabilitiesFilterDto,
} from "./dto";
import { JwtAuthGuard } from "../../../../../libs/guards/src";
import { UserReq } from "../../../../../libs/decorators/src";
import { User } from "../../../../../libs/entities";
import { ApiOperationDecorator } from "../../../../../libs/decorators/src";

@ApiTags("vulnerabilities")
@ApiBearerAuth("JWT-auth")
@UseGuards(JwtAuthGuard)
@Controller("vulnerabilities")
export class VulnerabilitiesController {
  constructor(
    private readonly vulnerabilitiesService: VulnerabilitiesService
  ) {}

  // Vulnerability management endpoints
  @Post()
  @ApiOperationDecorator({
    summary: "Create vulnerability",
    description: "Add a new vulnerability (CVE) to the database",
  })
  @ApiResponse({
    status: 201,
    description: "Vulnerability created successfully",
  })
  async createVulnerability(
    @Body() createVulnerabilityDto: CreateVulnerabilityDto
  ) {
    return await this.vulnerabilitiesService.createVulnerability(
      createVulnerabilityDto
    );
  }

  @Get()
  @ApiOperationDecorator({
    summary: "Get all vulnerabilities",
    description: "Retrieve all vulnerabilities with optional filtering",
  })
  @ApiResponse({
    status: 200,
    description: "Vulnerabilities retrieved successfully",
  })
  async findAllVulnerabilities(@Query() filter: VulnerabilitiesFilterDto) {
    return await this.vulnerabilitiesService.findAllVulnerabilities(filter);
  }

  @Get("stats")
  @ApiOperationDecorator({
    summary: "Get vulnerability statistics",
    description: "Get vulnerability counts by severity and status",
  })
  @ApiResponse({
    status: 200,
    description: "Statistics retrieved successfully",
  })
  async getStats() {
    return await this.vulnerabilitiesService.getVulnerabilityStats();
  }

  @Get("top/:limit")
  @ApiOperationDecorator({
    summary: "Get top vulnerabilities",
    description: "Get most critical vulnerabilities affecting multiple sites",
  })
  @ApiResponse({
    status: 200,
    description: "Top vulnerabilities retrieved successfully",
  })
  async getTopVulnerabilities(@Param("limit") limit: string) {
    return await this.vulnerabilitiesService.getTopVulnerabilities(
      parseInt(limit) || 10
    );
  }

  @Get(":id")
  @ApiOperationDecorator({
    summary: "Get vulnerability by ID",
    description: "Retrieve detailed vulnerability information",
  })
  @ApiResponse({
    status: 200,
    description: "Vulnerability found",
  })
  @ApiResponse({
    status: 404,
    description: "Vulnerability not found",
  })
  async findOneVulnerability(@Param("id") id: string) {
    return await this.vulnerabilitiesService.findOneVulnerability(id);
  }

  @Patch(":id")
  @ApiOperationDecorator({
    summary: "Update vulnerability",
    description: "Update vulnerability information",
  })
  @ApiResponse({
    status: 200,
    description: "Vulnerability updated successfully",
  })
  async updateVulnerability(
    @Param("id") id: string,
    @Body() updateVulnerabilityDto: UpdateVulnerabilityDto
  ) {
    return await this.vulnerabilitiesService.updateVulnerability(
      id,
      updateVulnerabilityDto
    );
  }

  @Delete(":id")
  @ApiOperationDecorator({
    summary: "Delete vulnerability",
    description: "Delete vulnerability by ID",
  })
  @ApiResponse({
    status: 204,
    description: "Vulnerability deleted successfully",
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeVulnerability(@Param("id") id: string) {
    return await this.vulnerabilitiesService.removeVulnerability(id);
  }

  // Site-Vulnerability relationship endpoints
  @Post("assign")
  @ApiOperationDecorator({
    summary: "Assign vulnerability to site",
    description: "Link a vulnerability to a specific site",
  })
  @ApiResponse({
    status: 201,
    description: "Vulnerability assigned to site successfully",
  })
  async assignVulnerabilityToSite(
    @Body() createSiteVulnerabilityDto: CreateSiteVulnerabilityDto
  ) {
    return await this.vulnerabilitiesService.assignVulnerabilityToSite(
      createSiteVulnerabilityDto
    );
  }

  @Get("sites/:siteId")
  @ApiOperationDecorator({
    summary: "Get site vulnerabilities",
    description: "Get all vulnerabilities for a specific site",
  })
  @ApiResponse({
    status: 200,
    description: "Site vulnerabilities retrieved successfully",
  })
  async findSiteVulnerabilities(
    @Param("siteId") siteId: string,
    @Query() filter: VulnerabilitiesFilterDto
  ) {
    return await this.vulnerabilitiesService.findSiteVulnerabilities(
      siteId,
      filter
    );
  }

  @Patch("sites/:siteId/:vulnerabilityId")
  @ApiOperationDecorator({
    summary: "Update site vulnerability",
    description: "Update site-specific vulnerability information",
  })
  @ApiResponse({
    status: 200,
    description: "Site vulnerability updated successfully",
  })
  async updateSiteVulnerability(
    @Param("siteId") siteId: string,
    @Param("vulnerabilityId") vulnerabilityId: string,
    @Body() updateDto: UpdateSiteVulnerabilityDto
  ) {
    return await this.vulnerabilitiesService.updateSiteVulnerability(
      siteId,
      vulnerabilityId,
      updateDto
    );
  }

  @Delete("sites/:siteId/:vulnerabilityId")
  @ApiOperationDecorator({
    summary: "Remove site vulnerability",
    description: "Remove vulnerability assignment from site",
  })
  @ApiResponse({
    status: 204,
    description: "Site vulnerability removed successfully",
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeSiteVulnerability(
    @Param("siteId") siteId: string,
    @Param("vulnerabilityId") vulnerabilityId: string
  ) {
    return await this.vulnerabilitiesService.removeSiteVulnerability(
      siteId,
      vulnerabilityId
    );
  }

  // Vulnerability scanning endpoints
  @Post("scan/:siteId")
  @ApiOperationDecorator({
    summary: "Scan site for vulnerabilities",
    description: "Perform vulnerability scan on a specific site",
  })
  @ApiResponse({
    status: 200,
    description: "Vulnerability scan completed",
  })
  async scanSite(@Param("siteId") siteId: string) {
    return await this.vulnerabilitiesService.scanSiteForVulnerabilities(siteId);
  }

  // Bulk operations
  @Post("sites/:siteId/:vulnerabilityId/resolve")
  @ApiOperationDecorator({
    summary: "Resolve site vulnerability",
    description: "Mark site vulnerability as resolved",
  })
  @ApiResponse({
    status: 200,
    description: "Vulnerability resolved successfully",
  })
  async resolveSiteVulnerability(
    @Param("siteId") siteId: string,
    @Param("vulnerabilityId") vulnerabilityId: string
  ) {
    return await this.vulnerabilitiesService.updateSiteVulnerability(
      siteId,
      vulnerabilityId,
      {
        status: "Resolved",
        last_scanned: Date.now(),
      }
    );
  }

  @Post("sites/:siteId/:vulnerabilityId/acknowledge")
  @ApiOperationDecorator({
    summary: "Acknowledge site vulnerability",
    description: "Mark site vulnerability as acknowledged",
  })
  @ApiResponse({
    status: 200,
    description: "Vulnerability acknowledged successfully",
  })
  async acknowledgeSiteVulnerability(
    @Param("siteId") siteId: string,
    @Param("vulnerabilityId") vulnerabilityId: string
  ) {
    return await this.vulnerabilitiesService.updateSiteVulnerability(
      siteId,
      vulnerabilityId,
      {
        status: "Acknowledged",
        last_scanned: Date.now(),
      }
    );
  }

  @Get("export/csv")
  @ApiOperationDecorator({
    summary: "Export vulnerabilities to CSV",
    description: "Export all vulnerabilities to CSV format",
  })
  @ApiResponse({
    status: 200,
    description: "CSV export prepared",
  })
  async exportCsv(@Query() filter: VulnerabilitiesFilterDto) {
    const data =
      await this.vulnerabilitiesService.findAllVulnerabilities(filter);
    return {
      message: "CSV export data prepared",
      data: data.vulnerabilities,
      filename: `vulnerabilities_export_${new Date().toISOString().split("T")[0]}.csv`,
    };
  }
}
