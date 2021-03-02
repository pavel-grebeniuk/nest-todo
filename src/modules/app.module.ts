import { Module, UnauthorizedException } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import * as Joi from '@hapi/joi';

import { TodoModule } from './todo/todo.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CommonModule } from './common/common.module';
import { CategoryModule } from './category/category.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USER: Joi.string().required(),
        DB_PASS: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        TOKEN_EXPIRED_IN: Joi.string().required(),
        AWS_REGION: Joi.string().required(),
        AWS_ACCESS_KEY_ID: Joi.string().required(),
        AWS_SECRET_ACCESS_KEY: Joi.string().required(),
        AWS_PUBLIC_BUCKET_NAME: Joi.string().required(),
        PORT: Joi.number(),
      }),
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
      cors: true,
    }),
    DatabaseModule,
    ScheduleModule.forRoot(),
    TodoModule,
    UserModule,
    AuthModule,
    CommonModule,
    CategoryModule,
  ],
})
export class AppModule {}
