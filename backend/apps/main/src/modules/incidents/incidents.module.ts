import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { IncidentsService } from "./incidents.service";
import { IncidentsController } from "./incidents.controller";
import { Incident, User, Site } from "@lib/entities";
import { AwsModule } from "../../aws/aws.module";
import { RedisModule } from "../redis/redis.module";
import { AIService } from "./ai.service";
import { Incident, User, Site } from "../../../libs/entities";

@Module({
  imports: [
    TypeOrmModule.forFeature([Incident, User, Site]),
    AwsModule,
    RedisModule,
  ],
  controllers: [IncidentsController],
  providers: [IncidentsService, AIService],
  exports: [IncidentsService, AIService],
})
export class IncidentsModule {}
