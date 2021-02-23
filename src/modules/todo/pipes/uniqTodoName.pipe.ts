import {
  ArgumentMetadata,
  ConflictException,
  Inject,
  Injectable,
  PipeTransform,
  Scope,
} from '@nestjs/common';
import { CONTEXT } from '@nestjs/graphql';

import { CreateTodoInput } from '../dto/createTodo.input';
import { TodoService } from '../todo.service';

@Injectable({ scope: Scope.REQUEST })
export class UniqTodoNamePipe implements PipeTransform {
  constructor(
    private readonly todoService: TodoService,
    @Inject(CONTEXT) private readonly context,
  ) {}
  async transform(
    value: CreateTodoInput,
    metadata: ArgumentMetadata,
  ): Promise<any> {
    const title = value.title;
    const userId = this.context?.user?.id;
    const todo = await this.todoService.getTodoByName(title, +userId);
    if (todo) {
      throw new ConflictException(`Todo with title ${title} already exist`);
    }
    return value;
  }
}
