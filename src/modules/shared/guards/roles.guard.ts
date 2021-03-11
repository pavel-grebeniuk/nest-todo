import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);

    // return true if it is not graphql
    if (!ctx.getInfo()) {
      return true;
    }

    const handler = context.getHandler();
    const { req } = ctx.getContext();

    const roles = this.reflector.get<string[]>('roles', handler);

    const user = req.user;
    if (roles && !user) {
      throw new UnauthorizedException();
    }

    if (!roles || (!roles.length && user)) {
      return true;
    }

    if (roles.length && user) {
      const hasRole = () => roles.includes(user.role);
      return user.role && hasRole();
    }
    return false;
  }
}
