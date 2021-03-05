import { Field, Float, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

import { TodoEntity } from '../../todo/models/todo.entity';

@ObjectType('Category')
@Entity('categories')
export class CategoryEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Field(() => String, { nullable: true })
  @Column({ length: 200 })
  name: string;

  @Field(() => [TodoEntity], { nullable: 'items' })
  @ManyToMany(() => TodoEntity, (todo) => todo.category)
  todos: TodoEntity[];

  @Field(() => Float, { defaultValue: 0 })
  newTodosCount: number;

  @Field(() => Float, { defaultValue: 0 })
  expiredTodosCount: number;
}
