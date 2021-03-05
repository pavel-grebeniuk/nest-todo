import { Args, Context, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { TodoQuery } from './models/todo.query.model';
import { TodoService } from './todo.service';
import { TodoEntity } from './models/todo.entity';
import { UserEntity } from '../user/models/user.entity';

@Resolver(() => TodoQuery)
export class TodoQueryResolver {
  constructor(private readonly todoService: TodoService) {}
  @Query(() => TodoQuery)
  todo() {
    return {};
  }

  @ResolveField()
  async todoById(@Args('id') id: number): Promise<TodoEntity> {
    return this.todoService.getTodoById(id);
  }

  @ResolveField()
  async todos(): // @Context('user') { id }: Partial<UserEntity>,
  Promise<TodoEntity[]> {
    return this.todoService.getTodos(1);
  }
}
