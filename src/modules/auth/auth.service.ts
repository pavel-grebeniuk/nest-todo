import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { UserService } from '../user/user.service';
import { SignUpInput } from './inputs/sign-up.input';
import { SignInInput } from './inputs/sign-in.input';
import { BasicService } from '../shared/services/basic.service';
import { AuthEntity } from './models/auth.entity';

@Injectable()
export class AuthService extends BasicService<AuthEntity> {
  private jwtSecret = this.configService.get('JWT_SECRET');
  constructor(
    @InjectRepository(AuthEntity) authRepository: Repository<AuthEntity>,
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    super(authRepository);
  }

  getToken(authHeader?: string) {
    if (!authHeader) {
      return;
    }
    const match = authHeader.match(/[Bb]earer (?<token>.*)/);
    if (!match) {
      return;
    }
    const { token } = match.groups;
    return token;
  }

  verifyToken(token: string) {
    try {
      return this.jwtService.verify(
        token,
        this.configService.get('JWT_SECRET'),
      );
    } catch (e) {
      return null;
    }
  }

  async signToken() {
    return this.jwtService.sign({}, { secret: this.jwtSecret });
  }

  async signUp(createUserInput: SignUpInput): Promise<string> {
    const cryptedPass = await this.generatePasswordHash(
      createUserInput.password,
    );
    const token = await this.signToken();
    const user = await this.userService.create({
      ...createUserInput,
      password: cryptedPass,
      tokens: [{ token }],
    });
    await this.userService.save(user);
    return token;
  }

  async signIn(input: SignInInput): Promise<string> {
    const user = await this.checkAuthorization(input);
    const token = await this.signToken();
    const allTokens = await user.tokens;
    user.tokens = Promise.resolve([...allTokens, { token }]);
    await this.userService.save(user);
    return token;
  }

  private async checkAuthorization(input: SignInInput) {
    const user = await this.userService.findOne({
      email: input.email,
    });

    const isPasswordValid = await bcrypt.compare(input.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('PASSWORD_NOT_VALID');
    }
    return user;
  }

  private generatePasswordHash(pass: string): Promise<string> {
    return new Promise((resolve, reject) => {
      bcrypt.hash(pass, 10, (err, hash) => {
        if (err) reject(err);
        resolve(hash);
      });
    });
  }
}
