import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
  Max,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateSiteDto {
  @ApiProperty({ example: "Production Web Server" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: "192.168.1.100" })
  @IsString()
  @IsNotEmpty()
  ip_address: string;

  @ApiProperty({ example: "example.com", required: false })
  @IsOptional()
  @IsString()
  domain_name?: string;

  @ApiProperty({ example: "web-prod-01", required: false })
  @IsOptional()
  @IsString()
  hostname?: string;

  @ApiProperty({ example: "Linux", required: false })
  @IsOptional()
  @IsString()
  server_type?: string;

  @ApiProperty({ example: 443, required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(65535)
  port?: number;
}

