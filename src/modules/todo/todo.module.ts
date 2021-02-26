import { forwardRef, Module } from '@nestjs/common';

import { TodoResolver } from './todo.resolver';
import { TodoService } from './todo.service';
import { UserModule } from '../user/user.module';
import { CommonModule } from '../common/common.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoEntity } from './entities/todo.entity';
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TodoEntity]),
    forwardRef(() => CommonModule),
    forwardRef(() => UserModule),
    CategoryModule,
  ],
  providers: [TodoResolver, TodoService],
  exports: [TodoService],
})
export class TodoModule {}
