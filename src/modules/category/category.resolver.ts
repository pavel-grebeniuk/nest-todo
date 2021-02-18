import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CategoryService } from './category.service';
import { CategoryEntity } from './entities/category.entity';

@Resolver((of) => CategoryEntity)
export class CategoryResolver {
  constructor(private categoryService: CategoryService) {}
  @Query((returns) => [CategoryEntity], { name: 'categories' })
  async getCategories(): Promise<CategoryEntity[]> {
    return this.categoryService.getCategories();
  }

  @Mutation((returns) => CategoryEntity)
  async createCategory(@Args('name') name: string) {
    return this.categoryService.createCategory(name);
  }
}
