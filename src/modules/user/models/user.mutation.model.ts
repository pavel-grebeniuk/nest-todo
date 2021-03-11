import { Field, ObjectType } from '@nestjs/graphql';
import { UserEntity } from './user.entity';

@ObjectType()
export class UserMutation {
  @Field(() => UserEntity, { description: 'Change user role' })
  changeRole: UserEntity;
}
