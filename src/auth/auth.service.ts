import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UserService } from '../user/user.service';
import { AuthTokenDto } from './dto/authToken.dto';
import { CreateUserInput } from '../user/dto/createUser.dto';
import { User } from '../user/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(userEmail: string, password: string): Promise<AuthTokenDto> {
    const user = await this.validateUser(userEmail, password);
    const token = await this.generateToken(user);
    return token;
  }

  async signUp(createUserInput: CreateUserInput): Promise<AuthTokenDto> {
    const user = await this.userService.createUser(createUserInput);
    if (!user) {
      throw new UnauthorizedException();
    }
    const token = await this.generateToken(user);
    return token;
  }

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

  private async generateToken(user: Partial<User>) {
    const { email, id } = user;
    return {
      access_token: this.jwtService.sign({ email, id }),
    };
  }
}
