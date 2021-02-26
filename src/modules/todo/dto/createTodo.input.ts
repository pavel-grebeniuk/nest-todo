import { Field, InputType } from '@nestjs/graphql';
import {
  ArrayUnique,
  IsDateString,
  IsOptional,
  IsString,
} from 'class-validator';
import { GraphQLUpload } from 'apollo-server-express';
import { FileUpload } from 'graphql-upload';
import { Exclude } from 'class-transformer';

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

  @Field((type) => GraphQLUpload, { nullable: true })
  @Exclude()
  file: FileUpload[];
}
