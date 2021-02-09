import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { TodoResolver } from './todo.resolver';
import { TodoService } from './todo.service';
import { Todo, TodoSchema } from './schemas/todo.schema';
import { UserModule } from '../user/user.module';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Todo.name, schema: TodoSchema }]),
    UserModule,
    CommonModule,
  ],
  providers: [TodoResolver, TodoService],
})
export class TodoModule {}
