import { Query, ResolveField, Resolver } from '@nestjs/graphql';
import { CategoryQuery } from './models/category.query.model';
import { CategoryService } from './category.service';
import { CategoryEntity } from './models/category.entity';

@Resolver(() => CategoryQuery)
export class CategoryQueryResolver {
  constructor(private readonly categoryService: CategoryService) {}
  @Query(() => CategoryQuery)
  async category() {
    return {};
  }

  @ResolveField()
  async categories(): Promise<CategoryEntity[]> {
    return this.categoryService.getCategories();
  }
}
