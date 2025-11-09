import { IsOptional, IsString, IsEnum, IsDateString } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";
import {
  IncidentSeverity,
  IncidentStatus,
  IncidentType,
} from "../../../../libs/entities/src/incident.entity";

export class IncidentsFilterDto {
  @ApiPropertyOptional({
    enum: [...Object.values(IncidentSeverity), "all"],
    description: "Filter by severity",
    example: "all",
  })
  @IsOptional()
  severity?: IncidentSeverity | "all";

  @ApiPropertyOptional({
    enum: [...Object.values(IncidentStatus), "all"],
    description: "Filter by status",
    example: "all",
  })
  @IsOptional()
  status?: IncidentStatus | "all";

  @ApiPropertyOptional({
    enum: [...Object.values(IncidentType), "all"],
    description: "Filter by type",
    example: "all",
  })
  @IsOptional()
  type?: IncidentType | "all";

  @ApiPropertyOptional({ description: "Filter from date (ISO string)" })
  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @ApiPropertyOptional({ description: "Filter to date (ISO string)" })
  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @ApiPropertyOptional({ description: "Filter by assignee user ID" })
  @IsOptional()
  @IsString()
  assignee?: string;

  @ApiPropertyOptional({ description: "Search query" })
  @IsOptional()
  @IsString()
  searchQuery?: string;

  @ApiPropertyOptional({ description: "Filter by site ID" })
  @IsOptional()
  @IsString()
  siteId?: string;
}

export class BulkActionDto {
  @ApiPropertyOptional({
    enum: ["close", "assign", "export"],
    description: "Bulk action to perform",
  })
  @IsString()
  action: "close" | "assign" | "export";

  @ApiPropertyOptional({ description: "Assignee ID for assign action" })
  @IsOptional()
  @IsString()
  assigneeId?: string;
}
