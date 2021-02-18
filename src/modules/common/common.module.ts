import { forwardRef, Module } from '@nestjs/common';
import { ScheduleService } from './services/schedule.service';

import { PubSubService } from './services/pubSub.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoEntity } from '../todo/entities/todo.entity';
import { TodoModule } from '../todo/todo.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TodoEntity]),
    forwardRef(() => TodoModule),
  ],
  providers: [ScheduleService, PubSubService],
  exports: [PubSubService],
})
export class CommonModule {}
