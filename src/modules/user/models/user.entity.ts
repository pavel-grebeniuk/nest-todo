import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToMany } from 'typeorm';

import { TodoEntity } from '../../todo/models/todo.entity';
import { BasicEntity } from '../../shared/entities/basic.entity';
import { AuthEntity } from '../../auth/models/auth.entity';

@ObjectType()
@Entity('users')
export class UserEntity extends BasicEntity {
  @Field(() => ID)
  id: number;

  @Column()
  @Field()
  name: string;

  @Column()
  @Field()
  email: string;

  @Column()
  password: string;

  @Field({ nullable: true })
  token: string;

  @OneToMany(() => AuthEntity, (auth) => auth.user, {
    cascade: true,
    onDelete: 'CASCADE',
    lazy: true,
  })
  tokens: AuthEntity[] | Promise<AuthEntity[]>;

  @Field(() => [TodoEntity])
  @OneToMany(() => TodoEntity, (todo) => todo.author, {
    lazy: true,
  })
  todos: TodoEntity[] | Promise<TodoEntity[]>;
}
