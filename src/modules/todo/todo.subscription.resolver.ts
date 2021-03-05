import { Context, ResolveField, Resolver, Subscription } from '@nestjs/graphql';
import { TodoSubscription } from './models/todo.subscription.model';
import { UserEntity } from '../user/models/user.entity';
import { TodoService } from './todo.service';

@Resolver(() => TodoSubscription)
export class TodoSubscriptionResolver {
  constructor(private readonly todoService: TodoService) {}
  @Subscription(() => TodoSubscription, {
    filter: (payload, _, context) => {
      return payload.expiredTodos.some(
        (todo) => todo.author.id === context.user.id,
      );
    },
    resolve: (payload, _, context) => {
      return payload.expiredTodos.filter(
        (todo) => todo.author.id === context.user.id,
      );
    },
  })
  todo() {
    return {};
  }

  @ResolveField()
  async expiredTodos(@Context('user') { id }: UserEntity): Promise<unknown> {
    return this.todoService.getExpiredTodos();
  }
}
