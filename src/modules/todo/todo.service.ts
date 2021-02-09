import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as moment from 'moment';

import { Todo } from './schemas/todo.schema';
import { CreateTodoInput } from './dto/createTodo.input';
import { UpdateTodoInput } from './dto/updateTodo.input';
import { TodoStatus } from './types/todoStatus.enum';

@Injectable()
export class TodoService {
  constructor(
    @InjectModel(Todo.name) private readonly todoModel: Model<Todo>,
  ) {}

  async getTodos(userId: string): Promise<Todo[]> {
    return this.todoModel.find({ author: userId }).exec();
  }

  async getTodoById(id: string): Promise<Todo> {
    try {
      const todo = await this.todoModel.findById(id);
      return todo;
    } catch (e) {
      throw new NotFoundException();
    }
  }

  async createTodo(
    createTodoInput: CreateTodoInput,
    userId: string,
  ): Promise<Todo> {
    if (!userId) {
      throw new ForbiddenException('User not authorized');
    }
    const todoForDb = {
      ...createTodoInput,
      status: TodoStatus.NEW,
      author: userId,
    };
    if (!createTodoInput.expiredDate) {
      todoForDb.expiredDate = moment().add(1, 'm').toISOString();
    }
    const createdTodo = new this.todoModel(todoForDb);
    return createdTodo.save();
  }

  async updateTodo(
    updateTodoInput: UpdateTodoInput,
    id: string,
  ): Promise<Todo> {
    const todo = await this.todoModel
      .findOneAndUpdate({ _id: id }, { $set: updateTodoInput }, { new: true })
      .exec();
    if (!todo) {
      throw new NotFoundException(`Todo ${id} not found`);
    }
    return todo;
  }

  async removeTodo(id: string): Promise<Todo> {
    const todo = await this.todoModel.findOneAndDelete({ _id: id });
    if (!todo) {
      throw new NotFoundException(`Todo id: ${id} not found`);
    }
    return todo;
  }
}
