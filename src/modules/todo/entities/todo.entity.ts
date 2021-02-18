import { Field, ID, ObjectType } from '@nestjs/graphql';

import { UserEntity } from '../../user/entities/user.entity';
import { TodoStatus } from '../types/todoStatus.enum';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CategoryEntity } from '../../category/entities/category.entity';

@ObjectType('Todo')
@Entity()
export class TodoEntity {
  @PrimaryGeneratedColumn()
  @Field((type) => ID)
  id: number;

  @Field()
  @Column()
  title: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  description?: string;

  @Field((type) => TodoStatus)
  @Column()
  status: TodoStatus;

  @Field({ nullable: true })
  @Column()
  expiredDate?: string;

  @Field((type) => UserEntity)
  @ManyToOne((type) => UserEntity, (user) => user.todos)
  author?: UserEntity;

  @Field((type) => [CategoryEntity])
  @ManyToMany((type) => CategoryEntity, (category) => category.todos, {
    cascade: true,
  })
  @JoinTable()
  category: CategoryEntity[];
}
