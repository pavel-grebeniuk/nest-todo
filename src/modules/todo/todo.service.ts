import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { LessThan, Repository } from 'typeorm';
import { PubSub } from 'graphql-subscriptions';
import { Cron, CronExpression } from '@nestjs/schedule';

import { CreateTodoInput } from './inputs/create-todo.input';
import { UpdateTodoInput } from './inputs/update-todo.input';
import { TodoStatus } from './types/todoStatus.enum';
import { TodoEntity } from './models/todo.entity';
import { UserService } from '../user/user.service';
import { CategoryService } from '../category/category.service';
import { Upload } from '../shared/classes/upload';
import { MediaService } from '../media/media.service';
import { GqlSubscriptionsEnum } from '../shared/constants/gql-subscriptions.enum';
import { BasicService } from '../shared/services/basic.service';
import { UserEntity } from '../user/models/user.entity';

@Injectable()
export class TodoService extends BasicService<TodoEntity> {
  constructor(
    @Inject('PUB_SUB') private readonly pubSub: PubSub,
    private readonly moduleRef: ModuleRef,
    @InjectRepository(TodoEntity)
    private todoRepository: Repository<TodoEntity>,
    private userService: UserService,
    private categoryService: CategoryService,
    private mediaService: MediaService,
  ) {
    super(todoRepository);
  }

  async getTodos(userId: number): Promise<TodoEntity[]> {
    return this.find({
      where: { author: userId },
      relations: ['author'],
    });
  }

  async getTodoById(id: number, userId?: number): Promise<TodoEntity> {
    return this.findOne(id, {
      relations: ['author'],
      where: {
        author: userId,
      },
    });
  }

  async createTodo(
    createTodoInput: CreateTodoInput,
    user: UserEntity,
  ): Promise<TodoEntity> {
    const categories = await this.categoryService.getCategoriesByName(
      createTodoInput.categories,
    );
    const todoForDb = {
      ...createTodoInput,
      author: user,
      categories,
    };
    if (!createTodoInput.expiredDate) {
      todoForDb.expiredDate = moment().add(1, 'h').toISOString();
    }
    const createdTodo = await this.todoRepository.create(todoForDb);
    const newTodo = await this.todoRepository.save(createdTodo);
    await this.categoryService.assignTodo(newTodo, categories);
    console.log(newTodo);
    return newTodo;
  }

  async updateTodo(
    updateTodoInput: UpdateTodoInput,
    id: number,
  ): Promise<TodoEntity> {
    const { categories, ...inputData } = updateTodoInput;
    const todo = await this.todoRepository.preload({
      id,
      ...inputData,
    });
    if (!todo) {
      throw new NotFoundException(`Todo ${id} not found`);
    }
    if (categories?.length) {
      const categoriesList = await this.categoryService.getCategoriesByName(
        categories,
      );
      todo.category.push(...categoriesList);
      await this.categoryService.assignTodo(todo, categoriesList);
    }
    return this.todoRepository.save(todo);
  }

  async removeTodo(id: number): Promise<TodoEntity> {
    const todo = await this.getTodoById(id, 1);
    for await (const { id } of todo.images) {
      await this.mediaService.delete(id);
    }
    await this.todoRepository.remove(todo);
    return { ...todo, id: +id };
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
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
        this.pubSub.publish(GqlSubscriptionsEnum.TODO_EXPIRED, {
          expiredTodos: todos,
        });
      } catch (e) {
        throw new BadRequestException();
      }
    }
  }

  async getExpiredTodos(): Promise<AsyncIterator<unknown>> {
    return this.pubSub.asyncIterator(GqlSubscriptionsEnum.TODO_EXPIRED);
  }

  async saveImages(files: Upload[], todoId: number) {
    const images = [];
    const todo = await this.getTodoById(todoId);
    if (!files || !files?.length) {
      return todo;
    }
    for await (const file of files) {
      const url = await this.mediaService.create(file);
      // const image = await this.filesService.saveUploadResult({ Location: url });
      // images.push(image);
    }
    todo.images = [...todo.images, ...images];
    return this.todoRepository.save(todo);
  }
}
