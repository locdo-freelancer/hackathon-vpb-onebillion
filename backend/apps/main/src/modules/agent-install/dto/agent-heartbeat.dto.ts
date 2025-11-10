import { IsString, IsObject, IsOptional } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class AgentHeartbeatDto {
  @ApiProperty({ description: "Agent token" })
  @IsString()
  token: string;

  @ApiPropertyOptional({ description: "System metrics from agent" })
  @IsOptional()
  @IsObject()
  metrics?: {
    cpu_usage?: number;
    memory_usage?: number;
    disk_usage?: number;
    uptime?: number;
  };

  @ApiPropertyOptional({ description: "Agent version" })
  @IsOptional()
  @IsString()
  version?: string;

  @ApiPropertyOptional({ description: "Agent status" })
  @IsOptional()
  @IsString()
  status?: string;
}
