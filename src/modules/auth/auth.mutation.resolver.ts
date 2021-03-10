import { Args, Mutation, ResolveField, Resolver } from '@nestjs/graphql';
import { AuthMutation } from './models/auth.mutation.model';
import { AuthService } from './auth.service';
import { SignInInput } from './inputs/sign-in.input';
import { SignUpInput } from './inputs/sign-up.input';

@Resolver(() => AuthMutation)
export class AuthMutationResolver {
  constructor(private readonly authService: AuthService) {}
  @Mutation(() => AuthMutation)
  auth() {
    return {};
  }

  @ResolveField()
  async signIn(@Args('input') input: SignInInput) {
    return this.authService.signIn(input);
  }

  @ResolveField()
  async signUp(@Args('input') input: SignUpInput) {
    return this.authService.signUp(input);
  }
}
