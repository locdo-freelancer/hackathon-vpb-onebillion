import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Notification } from "../../../../../libs/entities/src/notification.entity";
import { NotificationsService } from "./notifications.service";
import { NotificationsController } from "./notifications.controller";
import { AwsModule } from "../../aws/aws.module";
import { RedisModule } from "../redis/redis.module";

@Module({
  imports: [TypeOrmModule.forFeature([Notification]), AwsModule, RedisModule],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
