import { PartialType } from "@nestjs/swagger";
import { CreateRemediationActionDto } from "./create-remediation-action.dto";
import { IsOptional, IsEnum, IsNumber, Min, Max } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { RemediationStatus } from "../../../../libs/entities/src/remediation-action.entity";

export class UpdateRemediationActionDto extends PartialType(
  CreateRemediationActionDto
) {
  @ApiPropertyOptional({
    description: "Status of the remediation action",
    enum: RemediationStatus,
  })
  @IsOptional()
  @IsEnum(RemediationStatus)
  status?: RemediationStatus;

  @ApiPropertyOptional({
    description: "Progress percentage (0-100)",
    minimum: 0,
    maximum: 100,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  progress_percentage?: number;

  @ApiPropertyOptional({
    description: "Result or outcome of the remediation action",
  })
  @IsOptional()
  result?: string;

  @ApiPropertyOptional({
    description: "Actual cost incurred for this remediation",
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  actual_cost?: number;

  @ApiPropertyOptional({
    description: "Effectiveness score (0-100)",
    minimum: 0,
    maximum: 100,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  effectiveness_score?: number;

  @ApiPropertyOptional({ description: "Completion timestamp" })
  @IsOptional()
  @IsNumber()
  completed_at?: number;
}
