import { Field, InputType } from '@nestjs/graphql';
import { IsNumber, Validate } from 'class-validator';
import { ShouldExistValidator } from '../../shared/validators/should-exist.validator';
import { UserService } from '../user.service';

@InputType()
export class UserIdInput {
  @Validate(ShouldExistValidator, [{ service: UserService }])
  @IsNumber()
  @Field()
  id: number;
}
