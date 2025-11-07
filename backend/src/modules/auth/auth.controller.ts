import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { RegisterUserDto } from "./dto/register-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";
import { Public, ApiOperationDecorator, UserReq } from "@lib/decorators";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { User } from "@lib/entities";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post("register")
  @ApiOperationDecorator({
    summary: "Register new user",
    description: "Create a new user account",
  })
  async register(@Body() dto: RegisterUserDto) {
    const user = await this.authService.register(dto);
    return {
      message: "User registered successfully",
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        company_name: user.company_name,
      },
    };
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post("login")
  @ApiOperationDecorator({
    summary: "User login",
    description: "Authenticate user and return access token",
  })
  async login(@Body() dto: LoginUserDto) {
    return this.authService.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get("profile")
  @ApiOperationDecorator({
    summary: "Get user profile",
    description: "Retrieve authenticated user profile information",
  })
  async getProfile(@UserReq() user: User) {
    return {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      company_name: user.company_name,
      createdAt: user.createdAt,
    };
  }
}
