import { IsOptional, IsString } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";
import {
  ThreatSeverity,
  ThreatStatus,
  ThreatType,
} from '@lib/constant';

export class ThreatsFilterDto {
  @ApiPropertyOptional({
    enum: [...Object.values(ThreatSeverity), "all"],
    description: "Filter by severity",
    example: "all",
  })
  @IsOptional()
  severity?: ThreatSeverity | "all";

  @ApiPropertyOptional({
    enum: [...Object.values(ThreatType), "all"],
    description: "Filter by type",
    example: "all",
  })
  @IsOptional()
  type?: ThreatType | "all";

  @ApiPropertyOptional({
    enum: [...Object.values(ThreatStatus), "all"],
    description: "Filter by status",
    example: "all",
  })
  @IsOptional()
  status?: ThreatStatus | "all";

  @ApiPropertyOptional({ description: "Filter by country code" })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ description: "Filter by IP range (CIDR notation)" })
  @IsOptional()
  @IsString()
  ipRange?: string;

  @ApiPropertyOptional({
    enum: ["24h", "7d", "30d", "90d"],
    description: "Time range filter",
    example: "24h",
  })
  @IsOptional()
  timeRange?: "24h" | "7d" | "30d" | "90d" | "all";

  @ApiPropertyOptional({ description: "Search query" })
  @IsOptional()
  @IsString()
  searchQuery?: string;

  @ApiPropertyOptional({ description: "Filter by site ID" })
  @IsOptional()
  @IsString()
  siteId?: string;
}

