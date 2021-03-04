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
import { FilesService } from '../common/services/files.service';
import { Upload } from '../common/entities/upload';
import { MediaService } from '../media/media.service';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(TodoEntity)
    private todoRepository: Repository<TodoEntity>,
    private pubSubService: PubSubService,
    private userService: UserService,
    private categoryService: CategoryService,
    private filesService: FilesService,
    private mediaService: MediaService,
  ) {}

  async getTodos(userId: number): Promise<TodoEntity[]> {
    return this.todoRepository.find({
      where: { author: userId },
      relations: ['author'],
    });
  }

  async getTodoById(id: number): Promise<TodoEntity> {
    const todo = await this.todoRepository.findOne(id, {
      relations: ['author'],
    });
    if (!todo) {
      throw new NotFoundException();
    }
    return todo;
  }

  async getTodoByName(title: string, userId: number): Promise<TodoEntity> {
    return this.todoRepository.findOne({
      where: {
        title,
        author: userId,
      },
    });
  }

  async createTodo(
    createTodoInput: CreateTodoInput,
    userId: number,
  ): Promise<TodoEntity> {
    const user = await this.userService.getUserById(userId);
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
    const todo = await this.getTodoById(id);
    for await (const { id } of todo.images) {
      await this.mediaService.delete(id);
    }
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

  async saveImages(files: Upload[], todoId: number) {
    const images = [];
    const todo = await this.getTodoById(todoId);
    if (!files || !files?.length) {
      return todo;
    }
    for await (const file of files) {
      const url = await this.mediaService.create(file);
      const image = await this.filesService.saveUploadResult({ Location: url });
      images.push(image);
    }
    todo.images = [...todo.images, ...images];
    return this.todoRepository.save(todo);
  }

  async getTodosCountByStatus(
    userId: number,
    status: TodoStatus,
  ): Promise<number> {
    return this.todoRepository.count({
      where: {
        status,
        author: userId,
      },
    });
  }
}
