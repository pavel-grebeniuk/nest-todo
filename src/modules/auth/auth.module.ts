import { Module } from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { AuthMutationResolver } from './auth.mutation.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/models/user.entity';
import { AuthEntity } from './models/auth.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, AuthEntity])],
  providers: [AuthService, AuthResolver, AuthMutationResolver],
  exports: [AuthService],
})
export class AuthModule {}
