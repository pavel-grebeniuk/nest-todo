import { Field, InputType } from '@nestjs/graphql';
import { IsNumber, Validate } from 'class-validator';
import { ShouldExistValidator } from '../../shared/validators/should-exist.validator';
import { TodoService } from '../todo.service';

@InputType()
export class TodoIdInput {
  @Validate(ShouldExistValidator, [{ service: TodoService }])
  @IsNumber()
  @Field()
  id: number;
}
