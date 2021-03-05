import { forwardRef, Module } from '@nestjs/common';

import { TodoResolver } from './todo.resolver';
import { TodoService } from './todo.service';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoEntity } from './models/todo.entity';
import { CategoryModule } from '../category/category.module';
import { MediaModule } from '../media/media.module';
import { TodoQueryResolver } from './todo.query.resolver';
import { TodoMutationResolver } from './todo.mutation.resolver';
import { TodoSubscriptionResolver } from './todo.subscription.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([TodoEntity]),
    forwardRef(() => UserModule),
    // CategoryModule,
    // MediaModule,
  ],
  providers: [
    TodoService,
    TodoResolver,
    TodoQueryResolver,
    TodoMutationResolver,
    TodoSubscriptionResolver,
  ],
  exports: [TodoService],
})
export class TodoModule {}
