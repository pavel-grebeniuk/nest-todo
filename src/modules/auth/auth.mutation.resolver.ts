import { Args, Mutation, ResolveField, Resolver } from '@nestjs/graphql';
import { AuthMutation } from './models/auth.mutation.model';
import { AuthService } from './auth.service';
import { SignInInput } from './inputs/sign-in.input';
import { SignUpInput } from './inputs/sign-up.input';
import { Public } from '../shared/decorators/public.decorator';

@Resolver(() => AuthMutation)
export class AuthMutationResolver {
  constructor(private readonly authService: AuthService) {}
  @Public()
  @Mutation(() => AuthMutation)
  auth() {
    return {};
  }

  @Public()
  @ResolveField()
  async signIn(@Args('input') input: SignInInput) {
    return this.authService.signIn(input);
  }

  @Public()
  @ResolveField()
  async signUp(@Args('input') input: SignUpInput) {
    return this.authService.signUp(input);
  }
}
