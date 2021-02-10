import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { TodoEntity } from './entities/todo.entity';
import { TodoService } from './todo.service';
import { CreateTodoInput } from './dto/createTodo.input';
import { UpdateTodoInput } from './dto/updateTodo.input';
import { AuthGuard } from '../auth/auth.guard';
import { UserEntity } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';

@UseGuards(AuthGuard)
@Resolver((of) => TodoEntity)
export class TodoResolver {
  constructor(
    private todoService: TodoService,
    private userService: UserService,
  ) {}

  @Query((returns) => [TodoEntity], { name: 'todos' })
  async getTodos(@Context('user') { id }: Partial<UserEntity>) {
    return this.todoService.getTodos(id);
  }

  @Query((returns) => TodoEntity, { name: 'todo' })
  async getTodoById(@Args('id') id: string) {
    return this.todoService.getTodoById(id);
  }

  @Mutation((returns) => TodoEntity)
  async createTodo(
    @Args('createTodoInput') createTodoInput: CreateTodoInput,
    @Context('user') { id: userId }: Partial<UserEntity>,
  ) {
    return this.todoService.createTodo(createTodoInput, userId);
  }

  @Mutation((returns) => TodoEntity)
  async updateTodo(
    @Args('updateTodoInput') updateTodoInput: UpdateTodoInput,
    @Args('id') id: string,
  ) {
    return this.todoService.updateTodo(updateTodoInput, id);
  }

  @Mutation((returns) => TodoEntity)
  async removeTodo(@Args('id') id: string) {
    return this.todoService.removeTodo(id);
  }

  @ResolveField()
  async author(@Parent() { author }) {
    return this.userService.getUserById(author);
  }

  @Subscription((returns) => [TodoEntity], {
    name: 'expiredTodos',
    resolve: (payload, _, context) => {
      return payload.expiredTodos.filter(
        (todo) => todo.author === context.user.id,
      );
    },
  })
  expiredTodosHandler(@Context('user') { id }: Partial<UserEntity>) {
    return this.todoService.getExpiredTodos();
  }
}
