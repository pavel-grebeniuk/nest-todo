import { Field, InputType } from '@nestjs/graphql';
import {
  ArrayUnique,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { GraphQLUpload } from 'apollo-server-express';
import { Upload } from '../../shared/classes/upload';
import { ShouldExistValidator } from '../../shared/validators/should-exist.validator';
import { TodoService } from '../todo.service';

@InputType()
export class CreateTodoInput {
  @IsString()
  @Field()
  @Validate(
    ShouldExistValidator,
    [{ service: TodoService, prop: 'title', reverse: true }],
    { message: `Todo already exists` },
  )
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
  @Field(() => [String])
  readonly categories: string[];

  @Field(() => GraphQLUpload, { nullable: true })
  @IsOptional()
  readonly media: Upload[];
}
