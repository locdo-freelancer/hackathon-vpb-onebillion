import {
  IsString,
  IsEnum,
  IsOptional,
  IsObject,
  IsNumber,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { ThreatType, ThreatSeverity } from "@lib/constant";

export class ReportThreatDto {
  @ApiProperty({
    description: "Type of threat indicator",
    enum: ThreatType,
    example: ThreatType.IP,
  })
  @IsEnum(ThreatType)
  type: ThreatType;

  @ApiProperty({
    description: "Threat indicator value (IP, domain, hash, etc.)",
    example: "192.168.1.100",
  })
  @IsString()
  indicator: string;

  @ApiProperty({
    description: "Severity level of the threat",
    enum: ThreatSeverity,
    example: ThreatSeverity.HIGH,
  })
  @IsEnum(ThreatSeverity)
  severity: ThreatSeverity;

  @ApiProperty({
    description: "Description or context of the threat",
    example: "Detected multiple failed login attempts from this IP",
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: "Number of times this threat was detected",
    example: 5,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  count?: number;

  @ApiProperty({
    description: "Additional metadata about the threat",
    example: { port: 22, protocol: "ssh" },
    required: false,
  })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}
