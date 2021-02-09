import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as moment from 'moment';

import { Todo } from '../../todo/schemas/todo.schema';
import { TodoStatus } from '../../todo/types/todoStatus.enum';
import { PubSubService } from './pubSub.service';
import { TODO_EXPIRED } from '../constants/subscriptionTriggers';

@Injectable()
export class UpdateExpiredTodoService {
  constructor(
    @InjectModel(Todo.name) private todoModel: Model<Todo>,
    private pubSubService: PubSubService,
  ) {}
  async updateExpiredTodos() {
    try {
      await this.todoModel
        .updateMany(
          {
            expiredDate: { $lte: moment().toISOString() },
            status: { $ne: TodoStatus.EXPIRED },
          },
          {
            status: TodoStatus.EXPIRED,
          },
        )
        .exec((error, data) => {
          if (data.nModified) {
            this.pubSubService.publish(TODO_EXPIRED, {
              updateTodos: true,
            });
          }
        });
    } catch (e) {
      throw new BadRequestException();
    }
  }
}
