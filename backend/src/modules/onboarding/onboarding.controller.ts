import { Controller, Post, Body, Get, UseGuards } from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { OnboardingService } from "./onboarding.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ApiOperationDecorator, UserReq } from "@lib/decorators";
import { User } from "@lib/entities";
import {
  OnboardingProgressDto,
  CompleteOnboardingDto,
  ValidateIPDto,
  GenerateTokenDto,
} from "./dto";

@ApiTags("onboarding")
@ApiBearerAuth("JWT-auth")
@Controller("onboarding")
@UseGuards(JwtAuthGuard)
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  @Post("progress")
  @ApiOperationDecorator({
    summary: "Save onboarding progress",
    description: "Save user progress through onboarding steps",
  })
  async saveProgress(
    @Body() dto: OnboardingProgressDto,
    @UserReq() user: User
  ) {
    return this.onboardingService.saveProgress(user.id, dto);
  }

  @Post("complete")
  @ApiOperationDecorator({
    summary: "Complete onboarding",
    description: "Complete the onboarding process and create site",
  })
  async completeOnboarding(
    @Body() dto: CompleteOnboardingDto,
    @UserReq() user: User
  ) {
    return this.onboardingService.completeOnboarding(user.id, dto);
  }

  @Post("validate-ip")
  @ApiOperationDecorator({
    summary: "Validate IP address",
    description: "Validate if IP address is reachable and valid",
  })
  async validateIP(@Body() dto: ValidateIPDto) {
    return this.onboardingService.validateIP(dto.ipAddress);
  }

  @Post("generate-token")
  @ApiOperationDecorator({
    summary: "Generate install token",
    description: "Generate agent installation token for server type",
  })
  async generateToken(@Body() dto: GenerateTokenDto, @UserReq() user: User) {
    return this.onboardingService.generateInstallToken(user.id, dto.serverType);
  }

  @Get("validate-connectivity")
  @ApiOperationDecorator({
    summary: "Validate connectivity",
    description: "Validate network connectivity and agent authentication",
  })
  async validateConnectivity(@UserReq() user: User) {
    return this.onboardingService.validateConnectivity(user.id);
  }
}
