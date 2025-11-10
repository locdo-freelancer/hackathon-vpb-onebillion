import {
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsObject,
  Min,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  MetricType,
  MetricCategory,
} from '@lib/constant';

export class CreateSecurityMetricDto {
  @ApiProperty({ description: "Site ID this metric belongs to" })
  @IsString()
  site_id: string;

  @ApiProperty({ description: "Name of the security metric" })
  @IsString()
  metric_name: string;

  @ApiProperty({
    description: "Type of the metric",
    enum: MetricType,
    default: MetricType.SECURITY_SCORE,
  })
  @IsEnum(MetricType)
  metric_type: MetricType;

  @ApiProperty({
    description: "Category of the metric",
    enum: MetricCategory,
    default: MetricCategory.SECURITY,
  })
  @IsEnum(MetricCategory)
  category: MetricCategory;

  @ApiProperty({
    description: "Numeric value of the metric",
    type: "number",
  })
  @IsNumber()
  metric_value: number;

  @ApiPropertyOptional({
    description: "Unit of measurement (e.g., percentage, count, ms)",
  })
  @IsOptional()
  @IsString()
  unit?: string;

  @ApiPropertyOptional({
    description: "Description of what this metric measures",
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: "Low threshold value for alerting",
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  threshold_low?: number;

  @ApiPropertyOptional({
    description: "Medium threshold value for alerting",
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  threshold_medium?: number;

  @ApiPropertyOptional({
    description: "High threshold value for alerting",
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  threshold_high?: number;

  @ApiPropertyOptional({
    description: "Critical threshold value for alerting",
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  threshold_critical?: number;

  @ApiPropertyOptional({
    description: "Previous value for trend analysis",
    type: "number",
  })
  @IsOptional()
  @IsNumber()
  previous_value?: number;

  @ApiPropertyOptional({ description: "Data source identifier" })
  @IsOptional()
  @IsString()
  source?: string;

  @ApiPropertyOptional({
    description: "Whether this metric is active",
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean = true;

  @ApiPropertyOptional({
    description: "Additional metadata as key-value pairs",
    type: "object",
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;

  @ApiPropertyOptional({
    description: "Historical data for trend analysis",
    type: "object",
  })
  @IsOptional()
  @IsObject()
  historical_data?: Record<string, any>;
}

