import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';

import { TodoEntity } from '../../todo/entities/todo.entity';

@Entity('publicFiles')
@ObjectType('File')
export class PublicFile {
  @PrimaryGeneratedColumn()
  public id: number;

  @Field()
  @Column()
  public url: string;

  @Field()
  @Column()
  public key: string;

  @ManyToOne((type) => TodoEntity, (todo) => todo.images)
  public todo: TodoEntity;
}
