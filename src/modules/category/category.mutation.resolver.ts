import { Args, Mutation, ResolveField, Resolver } from '@nestjs/graphql';
import { CategoryMutation } from './models/category.mutation.model';
import { CategoryService } from './category.service';
import { CategoryEntity } from './models/category.entity';

@Resolver(() => CategoryMutation)
export class CategoryMutationResolver {
  constructor(private readonly categoryService: CategoryService) {}
  @Mutation(() => CategoryMutation)
  async category() {
    return {};
  }

  @ResolveField()
  async createCategory(@Args('name') name: string): Promise<CategoryEntity> {
    return this.categoryService.createCategory(name);
  }
}
