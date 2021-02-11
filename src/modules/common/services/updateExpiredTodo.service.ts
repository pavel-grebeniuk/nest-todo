import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import * as moment from 'moment';

import { TodoStatus } from '../../todo/types/todoStatus.enum';
import { PubSubService } from './pubSub.service';
import { InjectRepository } from '@nestjs/typeorm';
import { TodoEntity } from '../../todo/entities/todo.entity';
import { TODO_EXPIRED } from '../constants/subscriptionTriggers';

@Injectable()
export class UpdateExpiredTodoService {
  constructor(
    @InjectRepository(TodoEntity)
    private todosRepository: Repository<TodoEntity>,
    private pubSubService: PubSubService,
  ) {}
  async updateExpiredTodos() {
    try {
      const todos = await this.todosRepository.find({
        where: {
          status: TodoStatus.NEW,
          expiredDate: { $lt: moment().toISOString() },
        },
      });
      if (todos.length) {
        todos.forEach((todo) => (todo.status = TodoStatus.EXPIRED));
        await this.todosRepository.save(todos);
        this.pubSubService.publish(TODO_EXPIRED, {
          expiredTodos: todos,
        });
      }
    } catch (e) {
      throw new BadRequestException();
    }
  }
}
