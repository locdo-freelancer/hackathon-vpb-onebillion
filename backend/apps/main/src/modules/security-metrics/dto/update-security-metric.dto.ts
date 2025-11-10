import { PartialType } from "@nestjs/swagger";
import { CreateSecurityMetricDto } from "./create-security-metric.dto";
import { IsOptional, IsEnum } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { AlertThreshold } from '@lib/constant';

export class UpdateSecurityMetricDto extends PartialType(
  CreateSecurityMetricDto
) {
  @ApiPropertyOptional({
    description: "Current alert level based on thresholds",
    enum: AlertThreshold,
  })
  @IsOptional()
  @IsEnum(AlertThreshold)
  current_alert_level?: AlertThreshold;

  @ApiPropertyOptional({
    description: "Percentage change from previous value",
    type: "number",
  })
  @IsOptional()
  change_percentage?: number;
}

