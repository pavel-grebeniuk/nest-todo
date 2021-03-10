import { Field, ObjectType } from '@nestjs/graphql';

import { Column, Entity, ManyToOne } from 'typeorm';

import { BasicEntity } from '../../shared/entities/basic.entity';
import { UserEntity } from '../../user/models/user.entity';

@Entity('auth')
@ObjectType({ description: 'Auth tokens' })
export class AuthEntity extends BasicEntity {
  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  readonly token?: string;

  @ManyToOne(() => UserEntity, (user) => user.tokens)
  user?: Promise<UserEntity>;
}
