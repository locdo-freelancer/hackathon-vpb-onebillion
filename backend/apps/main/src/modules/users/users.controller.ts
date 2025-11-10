import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { UsersService } from "./users.service";
import { User, Role } from "@lib/entities";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "@lib/guards";
import { ApiOperationDecorator, UserReq, Roles } from "@lib/decorators";

@ApiTags("users")
@ApiBearerAuth("JWT-auth")
@Controller("users")
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperationDecorator({
    summary: "Get all users",
    description: "Retrieve list of all registered users (Admin only)",
  })
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get("me")
  @ApiOperationDecorator({
    summary: "Get current user",
    description: "Retrieve authenticated user information",
  })
  getCurrentUser(@UserReq() user: User): User {
    return user;
  }

  @Get(":id")
  @ApiOperationDecorator({
    summary: "Get user by ID",
    description: "Retrieve specific user information by ID",
  })
  findOne(@Param("id") id: string): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperationDecorator({
    summary: "Create user",
    description: "Create a new user (Admin only)",
  })
  create(@Body() userData: Partial<User>): Promise<User> {
    return this.usersService.create(userData);
  }

  @Delete(":id")
  @Roles(Role.ADMIN)
  @ApiOperationDecorator({
    summary: "Delete user",
    description: "Remove user from system (Admin only)",
  })
  remove(@Param("id") id: string): Promise<void> {
    return this.usersService.remove(id);
  }
}
