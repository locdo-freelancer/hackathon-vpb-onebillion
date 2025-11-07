import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgentStatusTaskService } from './agent-status-task.service';
import { AgentEntity, Site } from 'libs/entities';

@Module({
  imports: [TypeOrmModule.forFeature([AgentEntity, Site])],
  providers: [AgentStatusTaskService],
})
export class TasksModule {}
