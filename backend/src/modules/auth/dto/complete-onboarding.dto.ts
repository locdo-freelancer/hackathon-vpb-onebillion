import { IsString, IsNotEmpty, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CompleteOnboardingDto {
  @ApiProperty({ example: 'My Production Site' })
  @IsString()
  @IsNotEmpty()
  siteName: string;

  @ApiProperty({ example: '192.168.1.100' })
  @IsString()
  @IsNotEmpty()
  ipAddress: string;

  @ApiProperty({ example: '8080' })
  @IsString()
  @IsNotEmpty()
  port: string;

  @ApiProperty({ example: 'example.com', required: false })
  @IsOptional()
  @IsString()
  domainName?: string;

  @ApiProperty({ example: 'windows', enum: ['windows'] })
  @IsEnum(['windows'])
  @IsNotEmpty()
  serverType: 'windows';

  @ApiProperty({ example: 'install-token-12345' })
  @IsString()
  @IsNotEmpty()
  installToken: string;
}
