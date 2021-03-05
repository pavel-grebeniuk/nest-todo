import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UserService } from '../user/user.service';
import { UserEntity } from '../user/models/user.entity';
import { SignUpInput } from './dto/sign-up.dto';
import { SignInInput } from './dto/sign-in.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn({ email, password }: SignInInput): Promise<string> {
    const user = await this.validateUser(email, password);
    const token = await this.generateToken(user);
    return token;
  }

  async signUp(createUserInput: SignUpInput): Promise<string> {
    const user = await this.userService.createUser(createUserInput);
    if (!user) {
      throw new UnauthorizedException();
    }
    const token = await this.generateToken(user);
    return token;
  }

  //todo add custom validator class
  private async validateUser(email: string, password: string) {
    const user = await this.userService.findUser(email);
    if (!user) {
      throw new NotFoundException(`User ${email} not found`);
    }
    const isPasswordValid = await this.checkPassword(password, user.password);
    if (isPasswordValid) {
      return user;
    } else {
      throw new UnauthorizedException();
    }
  }

  private async checkPassword(password, userPassword): Promise<boolean> {
    return bcrypt.compare(password, userPassword);
  }

  private async generateToken(user: Partial<UserEntity>) {
    const { email, id } = user;
    return this.jwtService.sign({ email, id });
  }
}
