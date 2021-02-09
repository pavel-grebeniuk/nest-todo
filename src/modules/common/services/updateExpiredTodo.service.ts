import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as moment from 'moment';

import { Todo } from '../../todo/schemas/todo.schema';
import { TodoStatus } from '../../todo/types/todoStatus.enum';

@Injectable()
export class UpdateExpiredTodoService {
  constructor(@InjectModel(Todo.name) private todoModel: Model<Todo>) {}
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
            console.log(data);
          }
        });
    } catch (e) {
      throw new BadRequestException();
    }
  }
}
