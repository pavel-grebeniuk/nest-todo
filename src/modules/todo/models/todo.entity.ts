import { Field, ID, ObjectType } from '@nestjs/graphql';

import { UserEntity } from '../../user/models/user.entity';
import { TodoStatus } from '../types/todoStatus.enum';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { CategoryEntity } from '../../category/models/category.entity';
import { BasicEntity } from '../../shared/entities/basic.entity';
import { Media } from '../../media/models/media.entity';

@ObjectType('Todo')
@Entity('todos')
export class TodoEntity extends BasicEntity {
  @Field(() => ID)
  id: number;

  @Field()
  @Column()
  title: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  description?: string;

  @Field(() => TodoStatus)
  @Column({
    type: 'enum',
    enum: TodoStatus,
    default: TodoStatus.NEW,
  })
  status: TodoStatus;

  @Field({ nullable: true })
  @Column()
  expiredDate?: string;

  @Field(() => UserEntity)
  @ManyToOne(() => UserEntity, (user) => user.todos)
  author?: UserEntity;

  @Field(() => [CategoryEntity])
  @ManyToMany(() => CategoryEntity, (category) => category.todos, {
    eager: true,
    cascade: true,
  })
  @JoinTable({ name: 'todos_categories' })
  category: CategoryEntity[];

  @Field(() => [Media])
  @OneToMany(() => Media, (media) => media.todo, {
    eager: true,
    nullable: true,
  })
  images?: Media[];
}
