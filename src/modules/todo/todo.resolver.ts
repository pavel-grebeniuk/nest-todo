import { Resolver } from '@nestjs/graphql';

import { TodoEntity } from './models/todo.entity';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';

//todo change to middleware
// todo check todo id if exist and user
@UseGuards(AuthGuard)
@Resolver()
export class TodoResolver {}
