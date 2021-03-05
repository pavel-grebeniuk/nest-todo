import { Args, Mutation, ResolveField, Resolver } from '@nestjs/graphql';
import { AuthMutation } from './models/auth.mutation.model';
import { AuthService } from './auth.service';
import { SignInInput } from './dto/sign-in.dto';
import { SignUpInput } from './dto/sign-up.dto';

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
