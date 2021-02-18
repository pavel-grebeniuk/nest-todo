import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TodoEntity } from '../../todo/entities/todo.entity';

@ObjectType('User')
@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  @Field((type) => ID)
  id: number;

  @Column()
  @Field()
  name: string;

  @Column()
  @Field()
  email: string;

  @Column()
  @Field()
  password: string;

  @Field((type) => [TodoEntity])
  @OneToMany((type) => TodoEntity, (todo) => todo.author)
  todos: TodoEntity[];
}
