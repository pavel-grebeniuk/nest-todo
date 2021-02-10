import { Field, ID, ObjectType } from '@nestjs/graphql';

import { UserEntity } from '../../user/entities/user.entity';
import { TodoStatus } from '../types/todoStatus.enum';
import { Column, Entity, ObjectIdColumn } from 'typeorm';

@ObjectType('Todo')
@Entity()
export class TodoEntity {
  @ObjectIdColumn()
  @Field((type) => ID)
  id: string;

  @Field()
  @Column()
  title: string;

  @Field({ nullable: true })
  @Column()
  description?: string;

  @Field((type) => TodoStatus)
  @Column()
  status: TodoStatus;

  @Field({ nullable: true })
  @Column()
  expiredDate?: string;

  @Field((type) => UserEntity)
  @Column()
  author?: string;
}
