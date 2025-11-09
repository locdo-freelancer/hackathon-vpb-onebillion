import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsIn,
  IsNumber,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class OnboardingProgressDto {
  @ApiProperty({ example: { siteName: "Production Server" } })
  @IsNotEmpty()
  data: any;

  @ApiProperty({ example: 1 })
  @IsNumber()
  step: number;
}

export class CompleteOnboardingDto {
  @ApiProperty({ example: "Production Web Server" })
  @IsString()
  @IsNotEmpty()
  siteName: string;

  @ApiProperty({ example: "192.168.1.100" })
  @IsString()
  @IsNotEmpty()
  ipAddress: string;

  @ApiProperty({ example: "443" })
  @IsString()
  @IsNotEmpty()
  port: string;

  @ApiProperty({ example: "example.com", required: false })
  @IsOptional()
  @IsString()
  domainName?: string;

  @ApiProperty({ example: "linux" })
  @IsString()
  @IsIn(["linux", "windows", "docker", "macos"])
  serverType: string;

  @ApiProperty({ example: "sv_abc123def456", required: false })
  @IsOptional()
  @IsString()
  installToken?: string;
}

export class ValidateIPDto {
  @ApiProperty({ example: "192.168.1.100" })
  @IsString()
  @IsNotEmpty()
  ipAddress: string;
}
