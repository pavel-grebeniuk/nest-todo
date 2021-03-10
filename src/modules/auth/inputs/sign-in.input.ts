import { Field, InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsString,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator';
import { ShouldExistValidator } from '../../shared/validators/should-exist.validator';
import { UserService } from '../../user/user.service';

@InputType()
export class SignInInput {
  @IsString()
  @IsEmail()
  @Validate(
    ShouldExistValidator,
    [{ service: UserService, prop: 'email', reverse: false }],
    { message: `User not found` },
  )
  @Field()
  email: string;

  @IsString()
  @MinLength(5)
  @MaxLength(20)
  @Field()
  password: string;
}
