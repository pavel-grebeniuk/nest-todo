import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AuthMutation {
  @Field(() => String, {
    description: 'Sign in with password and email',
  })
  signIn: string;

  @Field(() => String, {
    description: 'Sign up',
  })
  signUp: string;
}
