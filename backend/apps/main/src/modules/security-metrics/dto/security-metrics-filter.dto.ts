import {
  IsOptional,
  IsString,
  IsEnum,
  IsNumber,
  IsBoolean,
} from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";
import {
  MetricType,
  MetricCategory,
  AlertThreshold,
} from '@lib/constant';

export class SecurityMetricsFilterDto {
  @ApiPropertyOptional({ description: "Filter by site ID" })
  @IsOptional()
  @IsString()
  site_id?: string;

  @ApiPropertyOptional({
    description: "Filter by metric type",
    enum: MetricType,
  })
  @IsOptional()
  @IsEnum(MetricType)
  metric_type?: MetricType;

  @ApiPropertyOptional({
    description: "Filter by metric category",
    enum: MetricCategory,
  })
  @IsOptional()
  @IsEnum(MetricCategory)
  category?: MetricCategory;

  @ApiPropertyOptional({
    description: "Filter by alert level",
    enum: AlertThreshold,
  })
  @IsOptional()
  @IsEnum(AlertThreshold)
  current_alert_level?: AlertThreshold;

  @ApiPropertyOptional({ description: "Filter by metric name (partial match)" })
  @IsOptional()
  @IsString()
  metric_name?: string;

  @ApiPropertyOptional({ description: "Filter by data source" })
  @IsOptional()
  @IsString()
  source?: string;

  @ApiPropertyOptional({
    description: "Filter by active status",
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @ApiPropertyOptional({
    description: "Filter by minimum recorded date (timestamp)",
  })
  @IsOptional()
  @IsNumber()
  recorded_from?: number;

  @ApiPropertyOptional({
    description: "Filter by maximum recorded date (timestamp)",
  })
  @IsOptional()
  @IsNumber()
  recorded_to?: number;

  @ApiPropertyOptional({ description: "Filter by minimum metric value" })
  @IsOptional()
  @IsNumber()
  value_min?: number;

  @ApiPropertyOptional({ description: "Filter by maximum metric value" })
  @IsOptional()
  @IsNumber()
  value_max?: number;

  @ApiPropertyOptional({
    description: "Page number for pagination",
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  page?: number = 1;

  @ApiPropertyOptional({
    description: "Items per page for pagination",
    default: 10,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @IsNumber()
  limit?: number = 10;

  @ApiPropertyOptional({
    description: "Sort field",
    default: "recorded_at",
  })
  @IsOptional()
  @IsString()
  sort_by?: string = "recorded_at";

  @ApiPropertyOptional({
    description: "Sort order",
    enum: ["ASC", "DESC"],
    default: "DESC",
  })
  @IsOptional()
  @IsString()
  sort_order?: "ASC" | "DESC" = "DESC";
}

