import { Module } from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { AuthMutationResolver } from './auth.mutation.resolver';

@Module({
  providers: [AuthService, AuthResolver, AuthMutationResolver],
  exports: [AuthService],
})
export class AuthModule {}
