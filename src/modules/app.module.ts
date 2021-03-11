import { MiddlewareConsumer, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContextModule } from '@2muchcoffee/nestjs-context';

import * as ormOptions from '../ormconfig';
import { SharedModule } from './shared/shared.module';
import { configSchema } from './shared/config/config.schema';
import { GqlConfigService } from './shared/services/gql-config.service';
import { AuthMiddleware } from './shared/middleware/auth.middleware';

@Module({
  imports: [
    ContextModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: configSchema,
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
    GraphQLModule.forRootAsync({
      imports: [ConfigModule],
      useClass: GqlConfigService,
    }),
    TypeOrmModule.forRoot({
      ...ormOptions,
      migrationsRun: false,
      migrations: [],
    }),
    ScheduleModule.forRoot(),
    SharedModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
