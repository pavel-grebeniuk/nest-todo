import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

import { Column, Entity, ManyToOne } from 'typeorm';

import { BasicEntity } from '../../shared/entities/basic.entity';
import { TodoEntity } from '../../todo/models/todo.entity';

@Entity()
@ObjectType({ description: 'Media file' })
export class Media extends BasicEntity {
  @Field(() => ID, { nullable: true })
  id: number;

  @Field(() => String)
  @Column({ nullable: false })
  url: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  fileName: string;

  @Field(() => String, { nullable: true })
  @Column()
  mimetype?: string;

  @Field(() => Int, { nullable: true })
  @Column()
  size?: number;

  @ManyToOne(() => TodoEntity, (todo) => todo.images, {
    onDelete: 'CASCADE',
  })
  todo?: TodoEntity;
}
