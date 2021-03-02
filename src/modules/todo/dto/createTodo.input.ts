import { Field, InputType } from '@nestjs/graphql';
import {
  ArrayUnique,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { GraphQLUpload } from 'apollo-server-express';
import { Exclude } from 'class-transformer';
import { Upload } from '../../common/entities/upload';

@InputType()
export class CreateTodoInput {
  @IsString()
  @Field()
  readonly title: string;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  readonly description?: string;

  @IsOptional()
  @IsDateString()
  @Field({ nullable: true })
  expiredDate: string;

  @ArrayUnique()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @IsOptional()
  @Field((type) => [String])
  readonly categories: string[];

  @Field(() => GraphQLUpload, { nullable: true })
  @Exclude()
  readonly media: Upload[];
}
