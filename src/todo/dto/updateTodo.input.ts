import { Field, InputType, PartialType } from '@nestjs/graphql';
import { IsBoolean, IsOptional } from 'class-validator';

import { CreateTodoInput } from './createTodo.input';

@InputType()
export class UpdateTodoInput extends PartialType(CreateTodoInput) {
  @IsOptional()
  @IsBoolean()
  @Field()
  completed?: boolean;
}
