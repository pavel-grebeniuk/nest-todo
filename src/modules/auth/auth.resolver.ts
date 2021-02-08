import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { CreateUserInput } from '../user/dto/createUser.dto';
import { AuthTokenInterface } from './interfaces/authToken.interface';

@Resolver((of) => AuthTokenInterface)
export class AuthResolver {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}
  @Mutation((returns) => AuthTokenInterface)
  signIn(@Args('email') email: string, @Args('password') password: string) {
    return this.authService.signIn(email, password);
  }
  @Mutation((returns) => AuthTokenInterface)
  signUp(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.authService.signUp(createUserInput);
  }
}
