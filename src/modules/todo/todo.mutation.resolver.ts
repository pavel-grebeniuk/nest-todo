import { Args, Mutation, ResolveField, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { TodoMutation } from './models/todo.mutation.model';
import { TodoService } from './todo.service';
import { UserEntity } from '../user/models/user.entity';
import { CreateTodoInput } from './inputs/create-todo.input';
import { UpdateTodoInput } from './inputs/update-todo.input';
import { ActiveUser } from '../shared/decorators/user.decorator';
import { AuthGuard } from '../shared/guards/auth.guard';
import { TodoIdInput } from './inputs/todo-id.input';

// @UseGuards(AuthGuard)
@Resolver(() => TodoMutation)
export class TodoMutationResolver {
  constructor(private readonly todoService: TodoService) {}
  @Mutation(() => TodoMutation)
  todo() {
    return {};
  }

  @ResolveField()
  async createTodo(
    @Args('input')
    input: CreateTodoInput,
    @ActiveUser('user') user: UserEntity,
  ) {
    return this.todoService.createTodo(input, user);
  }

  @ResolveField()
  async updateTodo(
    @Args('input')
    input: UpdateTodoInput,
    @Args('args') { id }: TodoIdInput,
  ) {
    return this.todoService.updateTodo(input, id);
  }

  @ResolveField()
  async removeTodo(
    @Args('args') { id }: TodoIdInput,
    @ActiveUser('user') user: UserEntity,
  ) {
    return this.todoService.removeTodo(id, user.id);
  }
}
