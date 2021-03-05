import { Module } from '@nestjs/common';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublicFile } from '../shared/entities/publicFile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PublicFile])],
  controllers: [MediaController],
  providers: [MediaService],
  exports: [MediaService],
})
export class MediaModule {}
