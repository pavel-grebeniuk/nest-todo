import { Field, InputType, PartialType } from '@nestjs/graphql';
import { IsEnum, IsOptional } from 'class-validator';

import { CreateTodoInput } from './create-todo.input';
import { TodoStatus } from '../types/todoStatus.enum';

@InputType()
export class UpdateTodoInput extends PartialType(CreateTodoInput) {
  @IsOptional()
  @IsEnum(TodoStatus)
  @Field((type) => TodoStatus, { nullable: true })
  status?: TodoStatus;
}
