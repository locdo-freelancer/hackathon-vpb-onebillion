import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { SitesService } from "./sites.service";
import { CreateSiteDto } from "./dto/create-site.dto";
import { UpdateSiteDto } from "./dto/update-site.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ApiOperationDecorator, UserReq } from "@lib/decorators";
import { User } from "@lib/entities";

@ApiTags("sites")
@ApiBearerAuth("JWT-auth")
@Controller("sites")
@UseGuards(JwtAuthGuard)
export class SitesController {
  constructor(private readonly sitesService: SitesService) {}

  @Post()
  @ApiOperationDecorator({
    summary: "Create new site",
    description:
      "Register a new site for monitoring with agent token generation",
  })
  async create(@Body() createSiteDto: CreateSiteDto, @UserReq() user: User) {
    return this.sitesService.create(createSiteDto, user.id);
  }

  @Get()
  @ApiOperationDecorator({
    summary: "Get all user sites",
    description: "Retrieve all sites owned by authenticated user",
  })
  async findAll(@UserReq() user: User) {
    return this.sitesService.findAll(user.id);
  }

  @Get(":id")
  @ApiOperationDecorator({
    summary: "Get site by ID",
    description: "Retrieve detailed information of a specific site",
  })
  async findOne(@Param("id") id: string, @UserReq() user: User) {
    return this.sitesService.findOne(id, user.id);
  }

  @Patch(":id")
  @ApiOperationDecorator({
    summary: "Update site",
    description: "Update site information",
  })
  async update(
    @Param("id") id: string,
    @Body() updateSiteDto: UpdateSiteDto,
    @UserReq() user: User
  ) {
    return this.sitesService.update(id, user.id, updateSiteDto);
  }

  @Delete(":id")
  @ApiOperationDecorator({
    summary: "Delete site",
    description: "Remove a site from monitoring",
  })
  async remove(@Param("id") id: string, @UserReq() user: User) {
    return this.sitesService.remove(id, user.id);
  }
}
