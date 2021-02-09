import { Module } from '@nestjs/common';
import { ScheduleService } from './services/schedule.service';
import { UpdateExpiredTodoService } from './services/updateExpiredTodo.service';
import { MongooseModule } from '@nestjs/mongoose';

import { Todo, TodoSchema } from '../todo/schemas/todo.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Todo.name, schema: TodoSchema }]),
  ],
  providers: [ScheduleService, UpdateExpiredTodoService],
})
export class CommonModule {}
