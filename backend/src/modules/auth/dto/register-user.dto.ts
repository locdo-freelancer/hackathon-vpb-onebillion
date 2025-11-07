import { IsEmail, IsNotEmpty, MinLength, IsOptional } from "class-validator";

export class RegisterUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsNotEmpty()
  full_name: string;

  @IsOptional()
  company_name?: string;
}
