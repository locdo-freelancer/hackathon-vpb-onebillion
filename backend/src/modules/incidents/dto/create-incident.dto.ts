import {
  IsOptional,
  IsString,
  IsEnum,
  IsArray,
  IsObject,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IncidentSeverity,
  IncidentStatus,
  IncidentType,
} from "../../../../libs/entities/src/incident.entity";


export class CreateIncidentDto {
  @ApiProperty({ description: "Incident title" })
  @IsString()
  title: string;

  @ApiPropertyOptional({ description: "Incident description" })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: "AI-generated summary" })
  @IsOptional()
  @IsString()
  ai_summary?: string;

  @ApiProperty({
    enum: IncidentSeverity,
    description: "Incident severity",
    example: IncidentSeverity.HIGH,
  })
  @IsEnum(IncidentSeverity)
  severity: IncidentSeverity;

  @ApiProperty({
    enum: IncidentStatus,
    description: "Incident status",
    example: IncidentStatus.OPEN,
    default: IncidentStatus.OPEN,
  })
  @IsOptional()
  @IsEnum(IncidentStatus)
  status?: IncidentStatus;

  @ApiProperty({
    enum: IncidentType,
    description: "Incident type",
    example: IncidentType.MALWARE,
  })
  @IsEnum(IncidentType)
  type: IncidentType;

  @ApiPropertyOptional({ description: "Associated site ID" })
  @IsOptional()
  @IsString()
  site_id?: string;

  @ApiPropertyOptional({ description: "Assignee user ID" })
  @IsOptional()
  @IsString()
  assignee_id?: string;

  @ApiPropertyOptional({
    description: "List of affected systems",
    type: [String],
    example: ["web-prod-01", "db-mysql-01"],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  affected_systems?: string[];

  @ApiPropertyOptional({
    description: "Incident tags",
    type: [String],
    example: ["malware", "critical", "apt"],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ description: "Source IP address" })
  @IsOptional()
  @IsString()
  source_ip?: string;

  @ApiPropertyOptional({ description: "Destination IP address" })
  @IsOptional()
  @IsString()
  destination_ip?: string;

  @ApiPropertyOptional({ description: "Network protocol" })
  @IsOptional()
  @IsString()
  protocol?: string;

  @ApiPropertyOptional({
    description: "MITRE ATT&CK techniques",
    type: "object",
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  mitre_attack?: object[];

  @ApiPropertyOptional({
    description: "Timeline events",
    type: "object",
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  timeline?: object[];

  @ApiPropertyOptional({
    description: "Raw log entries",
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  raw_logs?: string[];

  @ApiPropertyOptional({
    description: "AI-generated recommendations",
    type: "object",
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  ai_recommendations?: object[];

  @ApiPropertyOptional({
    description: "File hash analysis",
    type: "object",
  })
  @IsOptional()
  @IsObject()
  file_hash?: object;

  @ApiPropertyOptional({
    description: "IP reputation data",
    type: "object",
  })
  @IsOptional()
  @IsObject()
  ip_reputation?: object;

  @ApiPropertyOptional({
    description: "Related incidents",
    type: "object",
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  related_incidents?: object[];

  @ApiPropertyOptional({
    description: "External references",
    type: "object",
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  external_references?: object[];

  @ApiPropertyOptional({
    description: "Related threat indicators",
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  related_indicators?: string[];

  @ApiPropertyOptional({
    description: "Remediation recommendations",
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  recommendations?: string[];

  @ApiPropertyOptional({
    description: "Evidence files and data",
    type: "object",
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  evidence?: object[];
}
