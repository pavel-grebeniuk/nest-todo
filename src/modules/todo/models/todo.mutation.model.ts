import { Field, ObjectType } from '@nestjs/graphql';
import { TodoEntity } from './todo.entity';

@ObjectType()
export class TodoMutation {
  @Field(() => TodoEntity, { description: 'Create todo' })
  createTodo: TodoEntity;

  @Field(() => TodoEntity, { description: 'Update todo' })
  updateTodo: TodoEntity;

  @Field(() => TodoEntity, { description: 'Remove todo' })
  removeTodo: TodoEntity;
}
