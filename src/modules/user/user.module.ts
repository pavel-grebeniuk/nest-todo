import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { UserEntity } from './models/user.entity';
import { UserQueryResolver } from './user.query.resolver';
import { UserMutationResolver } from './user.mutation.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [
    UserService,
    UserResolver,
    UserQueryResolver,
    UserMutationResolver,
  ],
  exports: [UserService],
})
export class UserModule {}
