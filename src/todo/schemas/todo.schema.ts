import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Todo extends Document {
  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  completed: boolean;

  @Prop()
  expiredDate: string;

  @Prop()
  author: string;
}

export const TodoSchema = SchemaFactory.createForClass(Todo);
