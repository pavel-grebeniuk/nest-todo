import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { LessThan, Repository } from 'typeorm';

import { CreateTodoInput } from './dto/createTodo.input';
import { UpdateTodoInput } from './dto/updateTodo.input';
import { TodoStatus } from './types/todoStatus.enum';
import { TodoEntity } from './entities/todo.entity';
import { PubSubService } from '../common/services/pubSub.service';
import { TODO_EXPIRED } from '../common/constants/subscriptionTriggers';
import { UserService } from '../user/user.service';
import { CategoryService } from '../category/category.service';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(TodoEntity)
    private todoRepository: Repository<TodoEntity>,
    private pubSubService: PubSubService,
    private userService: UserService,
    private categoryService: CategoryService,
  ) {}

  async getTodos(userId: number): Promise<TodoEntity[]> {
    return this.todoRepository.find({
      where: { author: userId },
      relations: ['author', 'category'],
    });
  }

  async getTodoById(id: number): Promise<TodoEntity> {
    const todo = await this.todoRepository.findOne(id, {
      relations: ['author', 'category'],
    });
    if (!todo) {
      throw new NotFoundException();
    }
    return todo;
  }

  async createTodo(
    createTodoInput: CreateTodoInput,
    userId: number,
  ): Promise<TodoEntity> {
    const user = await this.userService.getUserById(userId);
    if (!user) {
      throw new ForbiddenException('User not authorized');
    }
    const categories = await this.categoryService.getCategoriesByName(
      createTodoInput.categories,
    );

    const todoForDb = {
      ...createTodoInput,
      status: TodoStatus.NEW,
      author: user,
      categories,
    };
    if (!createTodoInput.expiredDate) {
      todoForDb.expiredDate = moment().add(1, 'h').toISOString();
    }
    const createdTodo = await this.todoRepository.create(todoForDb);
    const newTodo = await this.todoRepository.save(createdTodo);
    await this.categoryService.assignTodo(newTodo, categories);
    return newTodo;
  }

  async updateTodo(
    updateTodoInput: UpdateTodoInput,
    id: number,
  ): Promise<TodoEntity> {
    const todo = await this.todoRepository.preload({ id, ...updateTodoInput });
    if (!todo) {
      throw new NotFoundException(`Todo ${id} not found`);
    }
    return this.todoRepository.save(todo);
  }

  async removeTodo(id: number): Promise<TodoEntity> {
    const todo = await this.getTodoById(id);
    await this.todoRepository.remove(todo);
    return { ...todo, id: +id };
  }

  async updateExpiredTodos(): Promise<void> {
    const todos = await this.todoRepository.find({
      where: {
        status: TodoStatus.NEW,
        expiredDate: LessThan(moment().toISOString()),
      },
      relations: ['author'],
    });
    if (todos.length) {
      todos.forEach((todo) => (todo.status = TodoStatus.EXPIRED));
      try {
        await this.todoRepository.save(todos);
        this.pubSubService.publish(TODO_EXPIRED, {
          expiredTodos: todos,
        });
      } catch (e) {
        throw new BadRequestException();
      }
    }
  }

  async getExpiredTodos(): Promise<AsyncIterator<unknown>> {
    return this.pubSubService.subscribe(TODO_EXPIRED);
  }
}
