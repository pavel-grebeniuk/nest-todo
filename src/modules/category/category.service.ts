import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './models/category.entity';
import { In, Repository } from 'typeorm';
import { TodoStatus } from '../todo/types/todoStatus.enum';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
  ) {}

  async getCategories(): Promise<CategoryEntity[]> {
    return await this.categoryRepository
      .createQueryBuilder('cat')
      .select('cat.*')
      .leftJoin(
        'cat.todos',
        'todo',
        'todo.status IN (:newStatus, :expiredStatus)',
      )
      .addSelect(
        'COUNT(todo.id) filter (where todo.status = :newStatus)',
        'newTodosCount',
      )
      .addSelect(
        'COUNT(todo.id) filter (where todo.status = :expiredStatus)',
        'expiredTodosCount',
      )
      .setParameter('newStatus', TodoStatus.NEW)
      .setParameter('expiredStatus', TodoStatus.EXPIRED)
      .groupBy('cat.id')
      .getRawMany();
  }

  async getCategoriesByName(categories: string[]): Promise<CategoryEntity[]> {
    const existingCategories = await this.categoryRepository.find({
      where: {
        name: In(categories),
      },
      relations: ['todos'],
    });
    const categoriesList = categories
      .filter(
        (cat) => !existingCategories.some((category) => category.name === cat),
      )
      .map((name) => ({
        name,
        todos: [],
      }));
    const newCategories = await this.categoryRepository.save(categoriesList);
    return [...existingCategories, ...newCategories];
  }
}
