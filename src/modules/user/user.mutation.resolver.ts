import { Args, Mutation, ResolveField, Resolver } from '@nestjs/graphql';
import { UserMutation } from './models/user.mutation.model';
import { UserService } from './user.service';
import { ChangeRoleInput } from './inputs/change-role.input';

@Resolver(() => UserMutation)
export class UserMutationResolver {
  constructor(private readonly userService: UserService) {}
  @Mutation(() => UserMutation)
  user() {
    return {};
  }

  @ResolveField()
  async changeRole(@Args('input') { id, role }: ChangeRoleInput) {
    return this.userService.changeRole(id, role);
  }
}
