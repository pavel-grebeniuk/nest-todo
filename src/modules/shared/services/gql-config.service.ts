import { GqlModuleOptions } from '@nestjs/graphql';
import { UnauthorizedException } from '@nestjs/common';

export class GqlConfigService {
  createGqlOptions(): GqlModuleOptions {
    return {
      uploads: true,
      introspection: true,
      installSubscriptionHandlers: true,
      playground: true,
      autoSchemaFile: 'schema.graphql',
      context: ({ req, connection }) => {
        if (connection && !connection.context?.authorization) {
          throw new UnauthorizedException(
            'Request headers must include an authorization field',
          );
        }
        return {
          headers: connection ? connection.context : req.headers,
        };
      },
      cors: true,
    };
  }
}
