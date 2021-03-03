import { forwardRef, Module } from '@nestjs/common';

import { TodoResolver } from './todo.resolver';
import { TodoService } from './todo.service';
import { UserModule } from '../user/user.module';
import { CommonModule } from '../common/common.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoEntity } from './entities/todo.entity';
import { CategoryModule } from '../category/category.module';
import { MediaModule } from '../media/media.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TodoEntity]),
    forwardRef(() => CommonModule),
    forwardRef(() => UserModule),
    CategoryModule,
    MediaModule,
  ],
  providers: [TodoResolver, TodoService],
  exports: [TodoService],
})
export class TodoModule {}
