import { Field, ObjectType } from '@nestjs/graphql';
import { UserEntity } from './user.entity';

@ObjectType()
export class UserQuery {
  @Field(() => UserEntity, { description: 'Get current user' })
  getUserInfo: UserEntity;

  @Field(() => UserEntity, { description: 'Get user by id' })
  getUserById: UserEntity;
}
