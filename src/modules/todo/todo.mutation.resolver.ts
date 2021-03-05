import {
  Args,
  Context,
  Mutation,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { TodoMutation } from './models/todo.mutation.model';
import { TodoService } from './todo.service';
import { TodoEntity } from './models/todo.entity';
import { DefaultCategoryPipe } from '../category/pipes/defaultCategory.pipe';
import { UserEntity } from '../user/models/user.entity';
import { CreateTodoInput } from './dto/createTodo.input';
import { UpdateTodoInput } from './dto/updateTodo.input';

@Resolver(() => TodoMutation)
export class TodoMutationResolver {
  constructor(private readonly todoService: TodoService) {}
  @Mutation(() => TodoMutation)
  todo() {
    return {};
  }

  @ResolveField()
  async createTodo(
    //todo replace pipes to custom validator
    @Args(
      'input',
      // DefaultCategoryPipe,
      // UniqTodoNamePipe,
      // TransformUploadPipe,
    )
    input: CreateTodoInput,
    // @Context('user') { id: userId }: UserEntity,
  ) {
    const { id } = await this.todoService.createTodo(input, 1);
    return this.todoService.saveImages(input.media, id);
  }

  @ResolveField()
  async updateTodo(
    @Args('input')
    input: UpdateTodoInput,
    @Args('id') id: number,
  ) {
    return this.todoService.updateTodo(input, +id);
  }

  @ResolveField()
  async removeTodo(@Args('id') id: number) {
    return this.todoService.removeTodo(id);
  }
}
