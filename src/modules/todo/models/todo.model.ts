import { Field, ObjectType } from '@nestjs/graphql';

import { User } from '../../user/models/user.model';
import { TodoStatus } from '../types/todoStatus.enum';

@ObjectType()
export class Todo {
  @Field()
  id: string;

  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field((type) => TodoStatus)
  status: TodoStatus;

  @Field({ nullable: true })
  expiredDate?: string;

  @Field((type) => User)
  author?: User;
}
