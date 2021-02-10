import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as moment from 'moment';

import { CreateTodoInput } from './dto/createTodo.input';
import { UpdateTodoInput } from './dto/updateTodo.input';
import { TodoStatus } from './types/todoStatus.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TodoEntity } from './entities/todo.entity';
import { PubSubService } from '../common/services/pubSub.service';
import { TODO_EXPIRED } from '../common/constants/subscriptionTriggers';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(TodoEntity)
    private todoRepository: Repository<TodoEntity>,
    private pubSubService: PubSubService,
  ) {}

  async getTodos(userId: string): Promise<TodoEntity[]> {
    return this.todoRepository.find({ author: userId });
  }

  async getTodoById(id: string): Promise<TodoEntity> {
    const todo = await this.todoRepository.findOne(id);
    if (!todo) {
      throw new NotFoundException();
    }
    return todo;
  }

  async createTodo(
    createTodoInput: CreateTodoInput,
    userId: string,
  ): Promise<TodoEntity> {
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
    const createdTodo = await this.todoRepository.create(todoForDb);
    return this.todoRepository.save(createdTodo);
  }

  async updateTodo(
    updateTodoInput: UpdateTodoInput,
    id: string,
  ): Promise<TodoEntity> {
    let todo = await this.getTodoById(id);
    if (!todo) {
      throw new NotFoundException(`Todo ${id} not found`);
    }
    todo = { ...todo, ...updateTodoInput };
    return this.todoRepository.save(todo);
  }

  async removeTodo(id: string): Promise<TodoEntity> {
    const todo = await this.getTodoById(id);
    if (!todo) {
      throw new NotFoundException(`Todo id: ${id} not found`);
    }
    await this.todoRepository.remove(todo);
    return todo;
  }

  async getExpiredTodos() {
    return this.pubSubService.subscribe(TODO_EXPIRED);
  }
}
