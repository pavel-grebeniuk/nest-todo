import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { TodoModule } from '../todo/todo.module';
import { TransformUploadPipe } from './pipes/transform-upload.pipe';
import { AuthModule } from '../auth/auth.module';
import { CategoryModule } from '../category/category.module';
import { MediaModule } from '../media/media.module';
import { UserModule } from '../user/user.module';
import { JwtConfigService } from './services/jwt-config.service';
import { PubSubProvider } from './providers/pub-sub.provider';
import { StorageService } from './services/storage.service';
import { ShouldExistValidator } from './validators/should-exist.validator';
import { AuthGuard } from './guards/auth.guard';

const modules = [
  AuthModule,
  CategoryModule,
  MediaModule,
  TodoModule,
  UserModule,
];

const services = [StorageService];

const providers = [PubSubProvider, ShouldExistValidator, AuthGuard];

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      useClass: JwtConfigService,
    }),
    ...modules,
  ],
  providers: [...services, ...providers, TransformUploadPipe],
  exports: [
    TransformUploadPipe,
    ...modules,
    ...services,
    ...providers,
    JwtModule,
  ],
})
export class SharedModule {}
