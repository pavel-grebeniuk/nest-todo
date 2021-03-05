import { Context, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { UserQuery } from './models/user.query.model';
import { UserService } from './user.service';
import { UserEntity } from './models/user.entity';

@Resolver(() => UserQuery)
export class UserQueryResolver {
  constructor(private readonly userService: UserService) {}
  @Query(() => UserQuery)
  user() {
    return {};
  }

  @ResolveField()
  async getUserInfo(@Context('user') { id }: UserEntity) {
    return this.userService.getUserById(id);
  }
}
