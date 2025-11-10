import { Controller, Post, Get } from "@nestjs/common";
import { DatabaseSeederService } from "./database-seeder.service";
import { Public } from "@lib/decorators";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";

@ApiTags("database-seeder")
@Controller("seeder")
export class DatabaseSeederController {
  constructor(private readonly seederService: DatabaseSeederService) {}

  @Post("seed-database")
  @Public()
  @ApiOperation({
    summary: "Seed database with sample data",
    description:
      "Populates the database with sample users, sites, agents, incidents, threats, vulnerabilities, and metrics",
  })
  @ApiResponse({
    status: 201,
    description: "Database seeded successfully",
    schema: {
      type: "object",
      properties: {
        message: { type: "string", example: "Database seeded successfully" },
        data: { type: "object" },
      },
    },
  })
  @ApiResponse({ status: 500, description: "Internal server error" })
  async seedDatabase() {
    return await this.seederService.seedAll();
  }

  @Get("status")
  @Public()
  @ApiOperation({
    summary: "Check seeder status",
    description: "Returns the status of the database seeder service",
  })
  @ApiResponse({
    status: 200,
    description: "Seeder status retrieved successfully",
    schema: {
      type: "object",
      properties: {
        message: { type: "string" },
        endpoint: { type: "string" },
      },
    },
  })
  getStatus() {
    return {
      message: "Database seeder is ready",
      endpoint: "POST /api/seeder to seed the database",
    };
  }
}
