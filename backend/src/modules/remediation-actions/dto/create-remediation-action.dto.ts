import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsObject,
  Min,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  RemediationPriority,
  RemediationType,
} from "../../../../libs/constant/src";

export class CreateRemediationActionDto {
  @ApiProperty({
    description: "Site ID where the remediation action will be performed",
  })
  @IsString()
  site_id: string;

  @ApiProperty({ description: "Type of remediation action" })
  @IsString()
  action_type: string;

  @ApiPropertyOptional({
    description: "Detailed description of the remediation action",
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: "Priority level of the remediation action",
    enum: RemediationPriority,
    default: RemediationPriority.MEDIUM,
  })
  @IsEnum(RemediationPriority)
  priority: RemediationPriority;

  @ApiProperty({
    description: "Type of remediation (manual, automated, semi-automated)",
    enum: RemediationType,
    default: RemediationType.MANUAL,
  })
  @IsEnum(RemediationType)
  remediation_type: RemediationType;

  @ApiPropertyOptional({
    description: "User ID assigned to perform this action",
  })
  @IsOptional()
  @IsString()
  assigned_to?: string;

  @ApiPropertyOptional({ description: "Due date timestamp for completion" })
  @IsOptional()
  @IsNumber()
  due_date?: number;

  @ApiPropertyOptional({ description: "Associated incident ID" })
  @IsOptional()
  @IsString()
  incident_id?: string;

  @ApiPropertyOptional({ description: "Associated threat indicator ID" })
  @IsOptional()
  @IsString()
  threat_indicator_id?: string;

  @ApiPropertyOptional({ description: "Associated site vulnerability ID" })
  @IsOptional()
  @IsString()
  site_vulnerability_id?: string;

  @ApiPropertyOptional({
    description: "Estimated cost for this remediation action",
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  cost_estimate?: number;

  @ApiPropertyOptional({
    description: "Additional notes about the remediation action",
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({
    description: "Additional metadata as key-value pairs",
    type: "object",
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

