import { Query, ResolveField, Resolver } from '@nestjs/graphql';
import { CategoryQuery } from './models/category.query.model';
import { CategoryService } from './category.service';

@Resolver(() => CategoryQuery)
export class CategoryQueryResolver {
  constructor(private readonly categoryService: CategoryService) {}
  @Query(() => CategoryQuery)
  async category() {
    return {};
  }

  @ResolveField()
  async categories() {
    return this.categoryService.getCategories();
  }
}
