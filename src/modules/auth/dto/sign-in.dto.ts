import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

@InputType()
export class SignInInput {
  @IsString()
  @IsEmail()
  @Field()
  email: string;

  @IsString()
  @MinLength(5)
  @MaxLength(20)
  @Field()
  password: string;
}
