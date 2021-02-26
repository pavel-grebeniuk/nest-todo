import { Field, ID, ObjectType } from '@nestjs/graphql';

import { UserEntity } from '../../user/entities/user.entity';
import { TodoStatus } from '../types/todoStatus.enum';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CategoryEntity } from '../../category/entities/category.entity';
import { PublicFile } from '../../common/entities/publicFile.entity';

@ObjectType('Todo')
@Entity('Todos')
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
  @Column({
    type: 'enum',
    enum: TodoStatus,
    default: TodoStatus.NEW,
  })
  status: TodoStatus;

  @Field({ nullable: true })
  @Column()
  expiredDate?: string;

  @Field((type) => UserEntity)
  @ManyToOne((type) => UserEntity, (user) => user.todos)
  author?: UserEntity;

  @Field((type) => [CategoryEntity])
  @ManyToMany((type) => CategoryEntity, (category) => category.todos, {
    eager: true,
    cascade: true,
  })
  @JoinTable({ name: 'Todos_categories' })
  category: CategoryEntity[];

  @Field((type) => [PublicFile])
  @OneToMany((type) => PublicFile, (publicFile) => publicFile.todo, {
    eager: true,
    nullable: true,
  })
  images?: PublicFile[];
}
