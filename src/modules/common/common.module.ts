import { Module } from '@nestjs/common';
import { ScheduleService } from './services/schedule.service';
import { UpdateExpiredTodoService } from './services/updateExpiredTodo.service';

import { PubSubService } from './services/pubSub.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoEntity } from '../todo/entities/todo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TodoEntity])],
  providers: [ScheduleService, UpdateExpiredTodoService, PubSubService],
  exports: [PubSubService],
})
export class CommonModule {}
