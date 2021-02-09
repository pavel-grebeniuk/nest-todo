import { Module, UnauthorizedException } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import { TodoModule } from './todo/todo.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.dev',
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_CONNECTION_STRING'),
      }),
      inject: [ConfigService],
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.graphql',
      installSubscriptionHandlers: true,
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
    }),
    ScheduleModule.forRoot(),
    TodoModule,
    UserModule,
    AuthModule,
    CommonModule,
  ],
})
export class AppModule {}
