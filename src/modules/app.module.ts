import { Module, UnauthorizedException } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import { TodoModule } from './todo/todo.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CommonModule } from './common/common.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: +configService.get<string>('DB_PORT', '5432'),
        username: configService.get<string>('DB_USER', 'postgres'),
        password: configService.get<string>('DB_PASS', 'postgres'),
        database: 'postgres',
        autoLoadEntities: true,
        synchronize: true,
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
      cors: true,
    }),
    ScheduleModule.forRoot(),
    TodoModule,
    UserModule,
    AuthModule,
    CommonModule,
    CategoryModule,
  ],
})
export class AppModule {}
