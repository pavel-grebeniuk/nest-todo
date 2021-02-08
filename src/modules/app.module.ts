import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphQLModule } from '@nestjs/graphql';

import { TodoModule } from './todo/todo.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/tododb', {
      useFindAndModify: false,
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.graphql',
      context: ({ req }) => ({ headers: req.headers }),
    }),
    TodoModule,
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}
