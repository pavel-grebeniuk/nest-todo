import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { AuthTokenDto } from './dto/authToken.dto';
import { CreateUserInput } from '../user/dto/createUser.dto';

@Resolver((of) => AuthTokenDto)
export class AuthResolver {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}
  @Mutation((returns) => AuthTokenDto)
  signIn(@Args('email') email: string, @Args('password') password: string) {
    return this.authService.signIn(email, password);
  }
  @Mutation((returns) => AuthTokenDto)
  signUp(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.authService.signUp(createUserInput);
  }
}
