import { Args, Mutation, ResolveField, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { TodoMutation } from './models/todo.mutation.model';
import { TodoService } from './todo.service';
import { UserEntity } from '../user/models/user.entity';
import { CreateTodoInput } from './inputs/create-todo.input';
import { UpdateTodoInput } from './inputs/update-todo.input';
import { ActiveUser } from '../shared/decorators/user.decorator';
import { AuthGuard } from '../shared/guards/auth.guard';

@UseGuards(AuthGuard)
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
    const todo = await this.todoService.createTodo(input, user);
    await this.todoService.saveImages(input.media, todo.id);
    return todo;
  }

  @ResolveField()
  async updateTodo(
    @Args('input')
    input: UpdateTodoInput,
    @Args('id') id: number,
  ) {
    return this.todoService.updateTodo(input, +id);
  }

  @ResolveField()
  async removeTodo(@Args('id') id: number) {
    return this.todoService.removeTodo(id);
  }
}
