import { Field, ObjectType } from '@nestjs/graphql';
import { UserEntity } from './user.entity';

@ObjectType()
export class UserQuery {
  @Field(() => UserEntity, { description: 'Get current user' })
  getUserInfo: UserEntity;
}
