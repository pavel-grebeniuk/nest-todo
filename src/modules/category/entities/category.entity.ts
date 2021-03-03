import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

import { TodoEntity } from '../../todo/entities/todo.entity';

@ObjectType('Category')
@Entity('categories')
export class CategoryEntity {
  @PrimaryGeneratedColumn()
  @Field((type) => ID)
  id: number;

  @Field()
  @Column()
  name: string;

  // @Field((type) => [TodoEntity], { nullable: 'items' })
  @ManyToMany((type) => TodoEntity, (todo) => todo.category)
  todos: TodoEntity[];

  @Field({ defaultValue: 0 })
  newTodosCount: number;
}
