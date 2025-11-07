import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SitesService } from "./sites.service";
import { SitesController } from "./sites.controller";
import { AuthModule } from "../auth/auth.module";
import { AgentEntity, Site, User } from "libs/entities";

@Module({
  imports: [TypeOrmModule.forFeature([Site, AgentEntity, User]), AuthModule],
  controllers: [SitesController],
  providers: [SitesService],
  exports: [SitesService],
})
export class SitesModule {}
