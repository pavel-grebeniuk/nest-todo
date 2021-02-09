import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { TodoStatus } from '../types/todoStatus.enum';

@Schema()
export class Todo extends Document {
  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  status: TodoStatus;

  @Prop()
  expiredDate: string;

  @Prop()
  author: string;
}

export const TodoSchema = SchemaFactory.createForClass(Todo);
