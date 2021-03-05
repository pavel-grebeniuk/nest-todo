import { Field, ObjectType } from '@nestjs/graphql';
import { CategoryEntity } from './category.entity';

@ObjectType()
export class CategoryMutation {
  @Field(() => CategoryEntity, {
    description: 'Create category',
  })
  readonly createCategory: CategoryEntity;

  @Field(() => CategoryEntity, {
    description: 'Update category',
  })
  readonly updateCategory: CategoryEntity;
}
