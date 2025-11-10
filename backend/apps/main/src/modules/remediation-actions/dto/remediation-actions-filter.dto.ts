import {
  IsOptional,
  IsString,
  IsEnum,
  IsDateString,
  IsNumber,
} from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";
import {
  RemediationStatus,
  RemediationPriority,
  RemediationType,
} from '@lib/constant';

export class RemediationActionsFilterDto {
  @ApiPropertyOptional({ description: "Filter by site ID" })
  @IsOptional()
  @IsString()
  site_id?: string;

  @ApiPropertyOptional({
    description: "Filter by status",
    enum: RemediationStatus,
  })
  @IsOptional()
  @IsEnum(RemediationStatus)
  status?: RemediationStatus;

  @ApiPropertyOptional({
    description: "Filter by priority",
    enum: RemediationPriority,
  })
  @IsOptional()
  @IsEnum(RemediationPriority)
  priority?: RemediationPriority;

  @ApiPropertyOptional({
    description: "Filter by remediation type",
    enum: RemediationType,
  })
  @IsOptional()
  @IsEnum(RemediationType)
  remediation_type?: RemediationType;

  @ApiPropertyOptional({ description: "Filter by assigned user" })
  @IsOptional()
  @IsString()
  assigned_to?: string;

  @ApiPropertyOptional({ description: "Filter by action type" })
  @IsOptional()
  @IsString()
  action_type?: string;

  @ApiPropertyOptional({ description: "Filter by incident ID" })
  @IsOptional()
  @IsString()
  incident_id?: string;

  @ApiPropertyOptional({ description: "Filter by threat indicator ID" })
  @IsOptional()
  @IsString()
  threat_indicator_id?: string;

  @ApiPropertyOptional({ description: "Filter by site vulnerability ID" })
  @IsOptional()
  @IsString()
  site_vulnerability_id?: string;

  @ApiPropertyOptional({
    description: "Filter by minimum due date (timestamp)",
  })
  @IsOptional()
  @IsNumber()
  due_date_from?: number;

  @ApiPropertyOptional({
    description: "Filter by maximum due date (timestamp)",
  })
  @IsOptional()
  @IsNumber()
  due_date_to?: number;

  @ApiPropertyOptional({
    description: "Filter by minimum execution date (timestamp)",
  })
  @IsOptional()
  @IsNumber()
  executed_from?: number;

  @ApiPropertyOptional({
    description: "Filter by maximum execution date (timestamp)",
  })
  @IsOptional()
  @IsNumber()
  executed_to?: number;

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
    default: "created_at",
  })
  @IsOptional()
  @IsString()
  sort_by?: string = "created_at";

  @ApiPropertyOptional({
    description: "Sort order",
    enum: ["ASC", "DESC"],
    default: "DESC",
  })
  @IsOptional()
  @IsString()
  sort_order?: "ASC" | "DESC" = "DESC";
}

