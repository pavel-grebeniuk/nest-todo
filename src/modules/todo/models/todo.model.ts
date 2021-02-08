import { Field, ObjectType } from '@nestjs/graphql';

import { User } from '../../user/models/user.model';

@ObjectType()
export class Todo {
  @Field()
  id: string;

  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  completed: boolean;

  @Field({ nullable: true })
  expiredDate?: string;

  @Field((type) => User)
  author?: User;
}
