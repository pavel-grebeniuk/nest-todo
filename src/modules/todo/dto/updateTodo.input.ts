import { Field, InputType, PartialType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

import { CreateTodoInput } from './createTodo.input';
import { TodoStatus } from '../types/todoStatus.enum';

@InputType()
export class UpdateTodoInput extends PartialType(CreateTodoInput) {
  @IsOptional()
  @Field((type) => TodoStatus, { nullable: true })
  status?: TodoStatus;
}
