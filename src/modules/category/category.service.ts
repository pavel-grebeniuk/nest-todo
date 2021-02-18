import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { Repository } from 'typeorm';
import { TodoEntity } from '../todo/entities/todo.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
  ) {}

  async getCategories(): Promise<CategoryEntity[]> {
    return this.categoryRepository.find({
      relations: ['todos'],
    });
  }

  async getCategoriesByName(categories: string[]): Promise<CategoryEntity[]> {
    const categoryList = [];
    for await (const cat of categories) {
      try {
        const categoryFromDb = await this.categoryRepository.findOne({
          where: {
            name: cat,
          },
          relations: ['todos'],
        });
        if (categoryFromDb) {
          categoryList.push(categoryFromDb);
          continue;
        }
      } catch (e) {
        console.log(e);
      }
      const newCategory = await this.createCategory(cat);
      categoryList.push(newCategory);
    }
    return categoryList;
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
