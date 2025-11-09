import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class AgentHeartbeatDto {
  @ApiProperty({
    example: "b5266534b06c6f7cba2b20f7b1747ff3178006328c00590b0144dee3c7847435",
  })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({ example: "1.0.0" })
  @IsString()
  @IsNotEmpty()
  version: string;

  @ApiProperty({ example: "Ubuntu 22.04.3 LTS" })
  @IsString()
  @IsNotEmpty()
  osInfo: string;

  @ApiProperty({ example: 25.5 })
  @IsNumber()
  @IsOptional()
  cpuUsage?: number;

  @ApiProperty({ example: 62.3 })
  @IsNumber()
  @IsOptional()
  memoryUsage?: number;

  @ApiProperty({ example: 45.8 })
  @IsNumber()
  @IsOptional()
  diskUsage?: number;

  @ApiProperty({ example: "192.168.1.100" })
  @IsString()
  @IsOptional()
  ipAddress?: string;

  @ApiProperty({ example: "demo-server.local" })
  @IsString()
  @IsOptional()
  hostname?: string;
}
