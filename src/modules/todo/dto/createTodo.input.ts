import { Field, InputType } from '@nestjs/graphql';
import {
  ArrayUnique,
  IsDateString,
  IsOptional,
  IsString,
} from 'class-validator';

@InputType()
export class CreateTodoInput {
  @IsString()
  @Field()
  title: string;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  description?: string;

  @IsOptional()
  @IsDateString()
  @Field({ nullable: true })
  expiredDate: string;

  @ArrayUnique()
  @IsString({ each: true })
  @IsOptional()
  @Field((type) => [String])
  categories: string[];
}
