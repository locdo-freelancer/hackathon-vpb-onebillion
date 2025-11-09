import {
  IsOptional,
  IsString,
  IsEnum,
  IsInt,
  IsArray,
  Min,
  Max,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  ThreatSeverity,
  ThreatStatus,
  ThreatType,
} from "../../../../libs/entities/src/threat-indicator.entity";

export class CreateThreatIndicatorDto {
  @ApiProperty({
    description: "Threat indicator value (IP, domain, URL, hash)",
  })
  @IsString()
  indicator: string;

  @ApiPropertyOptional({ description: "Threat description" })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    enum: ThreatType,
    description: "Indicator type",
    example: ThreatType.IP,
  })
  @IsEnum(ThreatType)
  type: ThreatType;

  @ApiProperty({
    enum: ThreatSeverity,
    description: "Threat severity",
    example: ThreatSeverity.HIGH,
    default: ThreatSeverity.MEDIUM,
  })
  @IsOptional()
  @IsEnum(ThreatSeverity)
  severity?: ThreatSeverity;

  @ApiPropertyOptional({
    description: "Confidence level (0-100)",
    minimum: 0,
    maximum: 100,
    default: 50,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  confidence?: number;

  @ApiPropertyOptional({ description: "Country name" })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ description: "Country code (ISO 2-letter)" })
  @IsOptional()
  @IsString()
  country_code?: string;

  @ApiPropertyOptional({ description: "Country flag emoji" })
  @IsOptional()
  @IsString()
  country_flag?: string;

  @ApiProperty({
    enum: ThreatStatus,
    description: "Threat status",
    example: ThreatStatus.MONITORING,
    default: ThreatStatus.MONITORING,
  })
  @IsOptional()
  @IsEnum(ThreatStatus)
  status?: ThreatStatus;

  @ApiPropertyOptional({ description: "Icon class for UI" })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiPropertyOptional({ description: "Icon color class for UI" })
  @IsOptional()
  @IsString()
  icon_color?: string;

  @ApiPropertyOptional({ description: "Internet Service Provider" })
  @IsOptional()
  @IsString()
  isp?: string;

  @ApiPropertyOptional({ description: "Autonomous System Number" })
  @IsOptional()
  @IsString()
  asn?: string;

  @ApiPropertyOptional({ description: "Organization name" })
  @IsOptional()
  @IsString()
  organization?: string;

  @ApiPropertyOptional({
    description: "Tags for categorization",
    type: [String],
    example: ["malware", "c2", "botnet"],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ description: "Malware family name" })
  @IsOptional()
  @IsString()
  malware_family?: string;

  @ApiPropertyOptional({
    description: "Intelligence data",
    type: "object",
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  intelligence?: object[];

  @ApiPropertyOptional({
    description: "Related threat indicators",
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  related_indicators?: string[];

  @ApiPropertyOptional({ description: "Associated site ID" })
  @IsOptional()
  @IsString()
  site_id?: string;
}
