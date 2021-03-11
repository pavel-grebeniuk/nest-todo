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
    });
  }

  async getTodoById(id: number, userId?: number): Promise<TodoEntity> {
    return this.findOne(id, {
      where: {
        author: userId,
      },
    });
  }

  async createTodo(
    input: CreateTodoInput,
    user: UserEntity,
  ): Promise<TodoEntity> {
    const { categories, media, ...entityData } = input;
    const todo = await this.todoRepository.merge(new TodoEntity(), entityData);
    const categoryList = await this.categoryService.getCategoriesByName(
      categories,
    );
    const images = await this.saveImages(media);
    todo.author = user;
    todo.category = categoryList;
    todo.images = images;
    return this.todoRepository.save(todo);
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
    if (categories) {
      const categoriesList = await this.categoryService.getCategoriesByName(
        categories,
      );
      todo.category = categoriesList;
    }
    return this.todoRepository.save(todo);
  }

  async removeTodo(id: number, userId: number): Promise<TodoEntity> {
    const todo = await this.getTodoById(id, userId);
    if (!todo) throw new NotFoundException();
    const images = await todo.images;
    await this.mediaService.delete(images);
    await this.todoRepository.remove(todo);
    return { ...todo, id };
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async updateExpiredTodos(): Promise<void> {
    const todos = await this.todoRepository.find({
      where: {
        status: TodoStatus.NEW,
        expiredDate: LessThan(moment().toISOString()),
      },
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

  async saveImages(files: Upload[]) {
    const images = [];
    for await (const file of files) {
      const url = await this.mediaService.create(file);
      images.push(url);
    }
    return images;
  }
}
