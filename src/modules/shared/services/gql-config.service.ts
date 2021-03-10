import { GqlModuleOptions } from '@nestjs/graphql';
import { ForbiddenException } from '@nestjs/common';
import { AuthService } from '../../auth/auth.service';

export class GqlConfigService {
  constructor(private readonly authService: AuthService) {}
  createGqlOptions(): GqlModuleOptions {
    return {
      uploads: true,
      introspection: true,
      installSubscriptionHandlers: true,
      playground: true,
      autoSchemaFile: 'schema.graphql',
      fieldResolverEnhancers: ['guards', 'interceptors'],
      subscriptions: {
        onConnect: async (connParams: any) => {
          const token = this.authService.getToken(connParams.authorization);
          const isVerified = await this.authService.verifyToken(token);
          const user = await this.authService.findOne(isVerified.id);
          if (!(user || isVerified)) {
            throw new ForbiddenException('FORBIDDEN_RESOURCE');
          }
          return { user };
        },
      },
      context: async ({ req, connection }) => {
        if (connection && connection.context) {
          return { req: connection.context };
        }
        return { req };
      },
      cors: true,
    };
  }
}
