import { Field, Float, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToMany } from 'typeorm';

import { TodoEntity } from '../../todo/models/todo.entity';
import { BasicEntity } from '../../shared/entities/basic.entity';

@ObjectType('Category')
@Entity('categories')
export class CategoryEntity extends BasicEntity {
  @Field(() => ID)
  id: number;

  @Field(() => String)
  @Column({ length: 200 })
  name: string;

  @ManyToMany(() => TodoEntity, (todo) => todo.category)
  todos: TodoEntity[];

  @Field(() => Float, { defaultValue: 0 })
  newTodosCount: number;

  @Field(() => Float, { defaultValue: 0 })
  expiredTodosCount: number;
}
