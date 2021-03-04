import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { In, Repository } from 'typeorm';
import { TodoEntity } from '../todo/entities/todo.entity';
import { TodoStatus } from '../todo/types/todoStatus.enum';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
  ) {}

  async getCategories(): Promise<CategoryEntity[]> {
    const data = await this.categoryRepository
      .createQueryBuilder('cat')
      .select('cat.*')
      .leftJoin('cat.todos', 'todo', 'todo.status=:status', {
        status: TodoStatus.NEW,
      })
      .addSelect('COUNT(todo.id)', 'newTodosCount')
      .groupBy('cat.id')
      .getRawMany();
    return data;
  }

  async getCategoriesByName(categories: string[]): Promise<CategoryEntity[]> {
    const catList = await this.categoryRepository.find({
      where: {
        name: In(categories),
      },
      relations: ['todos'],
    });
    const newCategories = categories.filter(
      (cat) => !catList.some((category) => category.name === cat),
    );
    const createdCategories = await Promise.all(
      newCategories.map((cat) => this.createCategory(cat)),
    );
    return [...catList, ...createdCategories];
  }

  async createCategory(name: string): Promise<CategoryEntity> {
    const category = await this.categoryRepository.create({
      name,
      todos: [],
    });
    return this.categoryRepository.save(category);
  }

  async assignTodo(
    todo: TodoEntity,
    categories: CategoryEntity[],
  ): Promise<void> {
    categories.forEach((cat) => cat.todos.push(todo));
    await this.categoryRepository.save(categories);
  }
}
