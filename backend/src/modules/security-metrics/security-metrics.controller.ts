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
import { JwtAuthGuard } from "libs/guards/src";
import { SecurityMetricsService } from "./security-metrics.service";
import {
  CreateSecurityMetricDto,
  UpdateSecurityMetricDto,
  SecurityMetricsFilterDto,
} from "./dto";
import { MetricType } from "libs/entities/src/security-metric.entity";

@ApiTags("Security Metrics")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("security-metrics")
export class SecurityMetricsController {
  constructor(
    private readonly securityMetricsService: SecurityMetricsService
  ) {}

  @Post()
  @ApiOperation({
    summary: "Create a new security metric",
    description:
      "Records a new security metric with automatic alert level calculation",
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Security metric created successfully",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Invalid input data",
  })
  async create(@Body() createDto: CreateSecurityMetricDto) {
    const securityMetric = await this.securityMetricsService.create(createDto);

    return {
      success: true,
      message: "Security metric created successfully",
      data: securityMetric,
    };
  }

  @Post("bulk")
  @ApiOperation({
    summary: "Create multiple security metrics",
    description: "Records multiple security metrics in a single operation",
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Security metrics created successfully",
  })
  async createBulk(@Body() createDtos: CreateSecurityMetricDto[]) {
    const securityMetrics =
      await this.securityMetricsService.createBulkMetrics(createDtos);

    return {
      success: true,
      message: `${securityMetrics.length} security metrics created successfully`,
      data: securityMetrics,
    };
  }

  @Get()
  @ApiOperation({
    summary: "Get all security metrics with filtering",
    description:
      "Retrieves a paginated list of security metrics with optional filtering",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Security metrics retrieved successfully",
  })
  async findAll(@Query() filters: SecurityMetricsFilterDto) {
    const result = await this.securityMetricsService.findAll(filters);

    return {
      success: true,
      message: "Security metrics retrieved successfully",
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
    summary: "Get security metrics statistics",
    description: "Retrieves comprehensive statistics about security metrics",
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
    const statistics = await this.securityMetricsService.getStatistics(siteId);

    return {
      success: true,
      message: "Statistics retrieved successfully",
      data: statistics,
    };
  }

  @Get("alerts")
  @ApiOperation({
    summary: "Get alerts count",
    description: "Retrieves count of active alerts by severity level",
  })
  @ApiQuery({
    name: "site_id",
    required: false,
    description: "Filter alerts by site ID",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Alerts count retrieved successfully",
  })
  async getAlertsCount(@Query("site_id") siteId?: string) {
    const alertsCount =
      await this.securityMetricsService.getAlertsCount(siteId);

    return {
      success: true,
      message: "Alerts count retrieved successfully",
      data: alertsCount,
    };
  }

  @Get("latest")
  @ApiOperation({
    summary: "Get latest metrics",
    description: "Retrieves the latest metric for each type",
  })
  @ApiQuery({
    name: "site_id",
    required: false,
    description: "Filter by site ID",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Latest metrics retrieved successfully",
  })
  async getLatestMetrics(@Query("site_id") siteId?: string) {
    const latestMetrics =
      await this.securityMetricsService.getLatestMetrics(siteId);

    return {
      success: true,
      message: "Latest metrics retrieved successfully",
      data: latestMetrics,
    };
  }

  @Get("historical/:siteId/:metricType")
  @ApiOperation({
    summary: "Get historical data for a specific metric type",
    description: "Retrieves time-series data for trend analysis",
  })
  @ApiQuery({
    name: "hours",
    required: false,
    description: "Time range in hours (default: 24)",
    type: "number",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Historical data retrieved successfully",
  })
  async getHistoricalData(
    @Param("siteId") siteId: string,
    @Param("metricType") metricType: MetricType,
    @Query("hours") hours = 24
  ) {
    const historicalData = await this.securityMetricsService.getHistoricalData(
      siteId,
      metricType,
      Number(hours)
    );

    return {
      success: true,
      message: "Historical data retrieved successfully",
      data: historicalData,
    };
  }

  @Get("site/:siteId")
  @ApiOperation({
    summary: "Get metrics by site",
    description: "Retrieves all metrics for a specific site",
  })
  @ApiQuery({
    name: "limit",
    required: false,
    description: "Maximum number of metrics to return",
    type: "number",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Site metrics retrieved successfully",
  })
  async getMetricsBySite(
    @Param("siteId") siteId: string,
    @Query("limit") limit = 100
  ) {
    const metrics = await this.securityMetricsService.getMetricsBySite(
      siteId,
      Number(limit)
    );

    return {
      success: true,
      message: "Site metrics retrieved successfully",
      data: metrics,
    };
  }

  @Get(":id")
  @ApiOperation({
    summary: "Get a specific security metric",
    description:
      "Retrieves detailed information about a specific security metric",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Security metric retrieved successfully",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Security metric not found",
  })
  async findOne(@Param("id") id: string) {
    const securityMetric = await this.securityMetricsService.findOne(id);

    return {
      success: true,
      message: "Security metric retrieved successfully",
      data: securityMetric,
    };
  }

  @Patch(":id")
  @ApiOperation({
    summary: "Update a security metric",
    description:
      "Updates an existing security metric with automatic alert level recalculation",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Security metric updated successfully",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Security metric not found",
  })
  async update(
    @Param("id") id: string,
    @Body() updateDto: UpdateSecurityMetricDto
  ) {
    const securityMetric = await this.securityMetricsService.update(
      id,
      updateDto
    );

    return {
      success: true,
      message: "Security metric updated successfully",
      data: securityMetric,
    };
  }

  @Delete(":id")
  @ApiOperation({
    summary: "Delete a security metric",
    description: "Deletes a specific security metric permanently",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Security metric deleted successfully",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Security metric not found",
  })
  async remove(@Param("id") id: string) {
    await this.securityMetricsService.remove(id);

    return {
      success: true,
      message: "Security metric deleted successfully",
    };
  }
}
