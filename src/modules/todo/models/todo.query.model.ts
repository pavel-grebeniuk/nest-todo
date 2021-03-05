import { Field, ObjectType } from '@nestjs/graphql';
import { TodoEntity } from './todo.entity';

@ObjectType()
export class TodoQuery {
  @Field(() => [TodoEntity], {
    description: 'Get todos list',
  })
  todos: TodoEntity[];

  @Field(() => TodoEntity, {
    description: 'Get todo by id',
  })
  todoById: TodoEntity;
}
