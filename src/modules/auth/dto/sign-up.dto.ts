import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { SignInInput } from './sign-in.dto';

@InputType()
export class SignUpInput extends SignInInput {
  @IsString()
  @Field()
  name: string;
}
