import { Field, ObjectType } from '@nestjs/graphql';
import { CategoryEntity } from './category.entity';

@ObjectType()
export class CategoryQuery {
  @Field(() => CategoryEntity, {
    description: 'Get categories list',
  })
  readonly categories: CategoryEntity;
}
