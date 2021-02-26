import {
  Context,
  Float,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { UserService } from './user.service';
import { UserEntity } from './entities/user.entity';
import { AuthGuard } from '../auth/auth.guard';
import { TodoService } from '../todo/todo.service';
import { TodoStatus } from '../todo/types/todoStatus.enum';

@Resolver((of) => UserEntity)
export class UserResolver {
  constructor(
    private userService: UserService,
    private todoService: TodoService,
  ) {}
  @UseGuards(AuthGuard)
  @Query((returns) => UserEntity, { name: 'me' })
  getUserInfo(@Context('user') { id }: Partial<UserEntity>) {
    return this.userService.getUserById(id);
  }
  @ResolveField((type) => Float, { name: 'expiredTodosCount' })
  getExpiredTodosCount(@Parent() { id }: UserEntity): Promise<number> {
    return this.todoService.getTodosCountByStatus(id, TodoStatus.EXPIRED);
  }

  @ResolveField((type) => Float, { name: 'completedTodosCount' })
  getCompletedTodosCount(@Parent() { id }: UserEntity): Promise<number> {
    return this.todoService.getTodosCountByStatus(id, TodoStatus.COMPLETED);
  }
}
