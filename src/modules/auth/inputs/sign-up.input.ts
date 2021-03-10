import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsString, Validate } from 'class-validator';
import { SignInInput } from './sign-in.input';
import { ShouldExistValidator } from '../../shared/validators/should-exist.validator';
import { UserService } from '../../user/user.service';

@InputType()
export class SignUpInput extends SignInInput {
  @IsString()
  @IsEmail()
  @Validate(
    ShouldExistValidator,
    [{ service: UserService, prop: 'email', reverse: true }],
    { message: `User already exists` },
  )
  @Field()
  email: string;

  @IsString()
  @Field()
  name: string;
}
