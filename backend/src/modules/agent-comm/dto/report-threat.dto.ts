import {
  IsString,
  IsEnum,
  IsOptional,
  IsArray,
  IsInt,
  Min,
  Max,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { ThreatType, ThreatSeverity } from "../../../../libs/constant/src";

export class ReportThreatDto {
  @ApiProperty({
    description: "Threat indicator (IP, domain, URL, hash, etc.)",
    example: "192.168.1.100",
  })
  @IsString()
  indicator: string;

  @ApiProperty({
    enum: ThreatType,
    description: "Type of threat detected",
    example: ThreatType.IP,
  })
  @IsEnum(ThreatType)
  type: ThreatType;

  @ApiProperty({
    enum: ThreatSeverity,
    description: "Severity level",
    example: ThreatSeverity.HIGH,
  })
  @IsEnum(ThreatSeverity)
  severity: ThreatSeverity;

  @ApiProperty({
    description: "Description of the threat",
    example: "Multiple failed SSH login attempts detected",
  })
  @IsString()
  description: string;

  @ApiPropertyOptional({
    description: "Confidence level (0-100)",
    example: 85,
    minimum: 0,
    maximum: 100,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  confidence?: number;

  @ApiPropertyOptional({
    description: "Tags for categorization",
    example: ["ssh", "brute-force", "failed-login"],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({
    description: "Raw log entries related to this threat",
    example: [
      "Nov 10 14:23:45 server sshd[1234]: Failed password for root from 192.168.1.100",
      "Nov 10 14:23:47 server sshd[1234]: Failed password for admin from 192.168.1.100",
    ],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  raw_logs?: string[];

  @ApiPropertyOptional({
    description: "Additional metadata",
    example: { port: 22, protocol: "ssh", failed_attempts: 15 },
  })
  @IsOptional()
  metadata?: Record<string, any>;
}
