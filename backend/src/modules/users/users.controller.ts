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
import { User } from "@lib/entities";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ApiOperationDecorator, UserReq } from "@lib/decorators";

@ApiTags("users")
@ApiBearerAuth("JWT-auth")
@Controller("users")
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperationDecorator({
    summary: "Get all users",
    description: "Retrieve list of all registered users",
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
  @ApiOperationDecorator({
    summary: "Create user",
    description: "Create a new user (admin only)",
  })
  create(@Body() userData: Partial<User>): Promise<User> {
    return this.usersService.create(userData);
  }

  @Delete(":id")
  @ApiOperationDecorator({
    summary: "Delete user",
    description: "Remove user from system (admin only)",
  })
  remove(@Param("id") id: string): Promise<void> {
    return this.usersService.remove(id);
  }
}
