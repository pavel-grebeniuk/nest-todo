import { forwardRef, Module } from '@nestjs/common';
import { ScheduleService } from './services/schedule.service';

import { PubSubService } from './services/pubSub.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoEntity } from '../todo/entities/todo.entity';
import { TodoModule } from '../todo/todo.module';
import { FilesService } from './services/files.service';
import { PublicFile } from './entities/publicFile.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TodoEntity, PublicFile]),
    forwardRef(() => TodoModule),
  ],
  providers: [ScheduleService, PubSubService, FilesService],
  exports: [PubSubService, FilesService],
})
export class CommonModule {}
