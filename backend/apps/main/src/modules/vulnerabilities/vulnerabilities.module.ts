import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { VulnerabilitiesService } from "./vulnerabilities.service";
import { VulnerabilitiesController } from "./vulnerabilities.controller";
import {
  Vulnerability,
  SiteVulnerability,
  Site,
} from "../../../../../libs/entities";

@Module({
  imports: [TypeOrmModule.forFeature([Vulnerability, SiteVulnerability, Site])],
  controllers: [VulnerabilitiesController],
  providers: [VulnerabilitiesService],
  exports: [VulnerabilitiesService],
})
export class VulnerabilitiesModule {}
