import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as moment from 'moment';

import { TodoDocument, Todo } from './schemas/todo.schema';
import { CreateTodoInput } from './dto/createTodo.input';
import { UpdateTodoInput } from './dto/updateTodo.input';

@Injectable()
export class TodoService {
  constructor(@InjectModel(Todo.name) private todoModel: Model<TodoDocument>) {}

  async getTodos(userId: string): Promise<TodoDocument[]> {
    return this.todoModel.find({ author: userId }).exec();
  }

  async getTodoById(id: string): Promise<TodoDocument> {
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
  ): Promise<TodoDocument> {
    if (!userId) {
      throw new ForbiddenException('User not authorized');
    }
    const todoForDb = { ...createTodoInput, completed: false, author: userId };
    if (!createTodoInput.expiredDate) {
      todoForDb.expiredDate = moment().add(1, 'd').toISOString();
    }
    const createdTodo = new this.todoModel(todoForDb);
    return createdTodo.save();
  }

  async updateTodo(
    updateTodoInput: UpdateTodoInput,
    id: string,
  ): Promise<TodoDocument> {
    try {
      await this.todoModel.updateOne({ _id: id }, updateTodoInput);
    } catch (e) {
      throw new NotFoundException();
    }
    return this.getTodoById(id);
  }

  async removeTodo(id: string): Promise<TodoDocument> {
    const todo = await this.todoModel.findOneAndDelete({ _id: id });
    if (!todo) {
      throw new NotFoundException(`Todo id: ${id} not found`);
    }
    return todo;
  }
}
