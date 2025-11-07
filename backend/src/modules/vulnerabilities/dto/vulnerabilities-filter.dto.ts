import { IsOptional, IsString, IsDateString } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class VulnerabilitiesFilterDto {
  @ApiPropertyOptional({
    description: "Filter by severity",
    example: "Critical",
  })
  @IsOptional()
  @IsString()
  severity?: string;

  @ApiPropertyOptional({
    description: "Filter by status",
    example: "Active",
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ description: "Filter from date (ISO string)" })
  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @ApiPropertyOptional({ description: "Filter to date (ISO string)" })
  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @ApiPropertyOptional({
    description: "Search query (CVE ID, title, description)",
  })
  @IsOptional()
  @IsString()
  searchQuery?: string;

  @ApiPropertyOptional({ description: "Filter by site ID" })
  @IsOptional()
  @IsString()
  siteId?: string;

  @ApiPropertyOptional({
    description: "Filter by CVSS score range",
    example: "7.0-10.0",
  })
  @IsOptional()
  @IsString()
  cvssRange?: string;
}
