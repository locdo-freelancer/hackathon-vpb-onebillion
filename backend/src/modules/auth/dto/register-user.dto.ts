import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  MinLength,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class RegisterUserDto {
  @ApiProperty({ example: "user@example.com" })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: "SecurePassword123!" })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: "John Doe" })
  @IsString()
  @IsNotEmpty()
  full_name: string;

  @ApiProperty({ example: "Example Corp", required: false })
  @IsOptional()
  @IsString()
  company_name?: string;
}

