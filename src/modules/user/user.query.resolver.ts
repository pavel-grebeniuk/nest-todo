import { Args, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { UserQuery } from './models/user.query.model';
import { UserService } from './user.service';
import { UserEntity } from './models/user.entity';
import { ActiveUser } from '../shared/decorators/user.decorator';
import { Roles } from '../shared/decorators/roles.decorator';
import { UserRole } from './types/user-roles.enum';
import { UserIdInput } from './inputs/user-id.input';

@Resolver(() => UserQuery)
export class UserQueryResolver {
  constructor(private readonly userService: UserService) {}
  @Query(() => UserQuery)
  user() {
    return {};
  }

  @ResolveField()
  async getUserInfo(@ActiveUser('user') { id }: UserEntity) {
    return this.userService.getUserById(id);
  }

  @ResolveField()
  @Roles(UserRole.ADMIN)
  async getUserById(@Args('input') { id }: UserIdInput) {
    return this.userService.getUserById(id);
  }
}
