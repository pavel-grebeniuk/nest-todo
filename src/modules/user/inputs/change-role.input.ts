import { Field, InputType } from '@nestjs/graphql';
import { IsEnum } from 'class-validator';

import { UserRole } from '../types/user-roles.enum';
import { UserIdInput } from './user-id.input';

@InputType()
export class ChangeRoleInput extends UserIdInput {
  @Field(() => UserRole)
  @IsEnum(UserRole)
  role: UserRole;
}
