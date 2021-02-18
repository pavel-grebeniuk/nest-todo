import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { TodoService } from '../../todo/todo.service';

@Injectable()
export class ScheduleService {
  constructor(private todoService: TodoService) {}
  @Cron(CronExpression.EVERY_10_SECONDS)
  handleExpiredTodo() {
    this.todoService.updateExpiredTodos();
  }
}
