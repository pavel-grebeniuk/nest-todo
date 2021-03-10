import { Module } from '@nestjs/common';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Media } from './models/media.entity';
import { MediaResolver } from './media.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Media])],
  controllers: [MediaController],
  providers: [MediaService, MediaResolver],
  exports: [MediaService],
})
export class MediaModule {}
