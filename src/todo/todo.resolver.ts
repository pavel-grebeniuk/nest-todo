import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { Todo } from './models/todo.model';
import { TodoService } from './todo.service';
import { CreateTodoInput } from './dto/createTodo.input';
import { UpdateTodoInput } from './dto/updateTodo.input';
import { AuthGuard } from '../auth/auth.guard';
import { User } from '../user/models/user.model';
import { UserService } from '../user/user.service';

@UseGuards(AuthGuard)
@Resolver((of) => Todo)
export class TodoResolver {
  constructor(
    private todoService: TodoService,
    private userService: UserService,
  ) {}

  @Query((returns) => [Todo], { name: 'todos' })
  async getTodos(@Context('user') { id }: Partial<User>) {
    return this.todoService.getTodos(id);
  }

  @Query((returns) => Todo, { name: 'todo' })
  async getTodoById(@Args('id') id: string) {
    return this.todoService.getTodoById(id);
  }

  @Mutation((returns) => Todo)
  async createTodo(
    @Args('createTodoInput') createTodoInput: CreateTodoInput,
    @Context('user') { id: userId }: Partial<User>,
  ) {
    return this.todoService.createTodo(createTodoInput, userId);
  }

  @Mutation((returns) => Todo)
  async updateTodo(
    @Args('updateTodoInput') updateTodoInput: UpdateTodoInput,
    @Args('id') id: string,
  ) {
    return this.todoService.updateTodo(updateTodoInput, id);
  }

  @Mutation((returns) => Todo)
  async removeTodo(@Args('id') id: string) {
    return this.todoService.removeTodo(id);
  }

  @ResolveField()
  async author(@Parent() { author }) {
    return this.userService.getUserById(author);
  }
}
