import { Resolver, Query, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { UserService } from './user.service';
import { User } from './models/user.model';
import { AuthGuard } from '../auth/auth.guard';

@Resolver((of) => User)
export class UserResolver {
  constructor(private userService: UserService) {}
  @UseGuards(AuthGuard)
  @Query((returns) => User, { name: 'me' })
  getUserInfo(@Context('user') { id }: Partial<User>) {
    return this.userService.getUserById(id);
  }
}
