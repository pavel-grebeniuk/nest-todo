import { Module } from '@nestjs/common';

import { TodoResolver } from './todo.resolver';
import { TodoService } from './todo.service';
import { UserModule } from '../user/user.module';
import { CommonModule } from '../common/common.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoEntity } from './entities/todo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TodoEntity]), UserModule, CommonModule],
  providers: [TodoResolver, TodoService],
})
export class TodoModule {}
