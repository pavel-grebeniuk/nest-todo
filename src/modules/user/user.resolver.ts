import { Resolver, Query, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { UserService } from './user.service';
import { UserEntity } from './entities/user.entity';
import { AuthGuard } from '../auth/auth.guard';

@Resolver((of) => UserEntity)
export class UserResolver {
  constructor(private userService: UserService) {}
  @UseGuards(AuthGuard)
  @Query((returns) => UserEntity, { name: 'me' })
  getUserInfo(@Context('user') { id }: Partial<UserEntity>) {
    return this.userService.getUserById(id);
  }
}
