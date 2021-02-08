import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AuthTokenInterface {
  @Field()
  access_token: string;
}
