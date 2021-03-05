import { Field, ObjectType } from '@nestjs/graphql';
import { TodoEntity } from './todo.entity';

@ObjectType()
export class TodoSubscription {
  @Field(() => [TodoEntity])
  expiredTodos: TodoEntity[];
}
