import { Args, Context, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { TodoQuery } from './models/todo.query.model';
import { TodoService } from './todo.service';
import { TodoEntity } from './models/todo.entity';
import { TodoIdInput } from './inputs/todo-id.input';
import { ActiveUser } from '../shared/decorators/user.decorator';
import { UserEntity } from '../user/models/user.entity';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../shared/guards/auth.guard';

@UseGuards(AuthGuard)
@Resolver(() => TodoQuery)
export class TodoQueryResolver {
  constructor(private readonly todoService: TodoService) {}
  @Query(() => TodoQuery)
  todo() {
    return {};
  }

  @ResolveField()
  async todoById(
    @Args('args') { id }: TodoIdInput,
    @ActiveUser('user') user: UserEntity,
  ): Promise<TodoEntity> {
    return this.todoService.getTodoById(id, user?.id);
  }

  @ResolveField()
  async todos(@ActiveUser('user') user: UserEntity): Promise<TodoEntity[]> {
    return this.todoService.getTodos(user?.id);
  }
}
