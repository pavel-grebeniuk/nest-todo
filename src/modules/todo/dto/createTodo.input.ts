import { Field, InputType } from '@nestjs/graphql';
import { IsDateString, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateTodoInput {
  @IsString()
  @Field()
  title: string;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  description?: string;

  @IsString()
  @IsOptional()
  @IsDateString()
  expiredDate: string;
}
