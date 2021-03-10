import { Injectable, NestMiddleware, Request, Response } from '@nestjs/common';

import { NextFunction } from 'express';

import { AuthService } from '../../auth/auth.service';
import { UserEntity } from '../../user/models/user.entity';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  async use(
    req: Request & { headers: { authorization: string }; user: UserEntity },
    res: Response,
    next: NextFunction,
  ) {
    const token = this.authService.getToken(req.headers.authorization);
    if (!token) {
      return next();
    }

    const isVerified = await this.authService.verifyToken(token);
    if (!isVerified) {
      return next();
    }

    const auth = await this.authService.findOne({ token });
    if (!auth?.user) {
      return next();
    }
    req.user = await auth.user;
    next();
  }
}
