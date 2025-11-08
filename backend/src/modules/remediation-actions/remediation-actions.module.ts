import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RemediationAction } from "libs/entities/src/remediation-action.entity";
import { RemediationActionsService } from "./remediation-actions.service";
import { RemediationActionsController } from "./remediation-actions.controller";

@Module({
  imports: [TypeOrmModule.forFeature([RemediationAction])],
  controllers: [RemediationActionsController],
  providers: [RemediationActionsService],
  exports: [RemediationActionsService],
})
export class RemediationActionsModule {}
