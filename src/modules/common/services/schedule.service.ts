import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { UpdateExpiredTodoService } from './updateExpiredTodo.service';

@Injectable()
export class ScheduleService {
  constructor(private updateExpiredTodoService: UpdateExpiredTodoService) {}
  @Cron(CronExpression.EVERY_10_SECONDS)
  handleExpiredTodo() {
    this.updateExpiredTodoService.updateExpiredTodos();
  }
}
