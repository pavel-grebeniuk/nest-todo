import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as fs from 'fs';
import { Upload } from '../common/entities/upload';
import { FilesService } from '../common/services/files.service';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { PublicFile } from '../common/entities/publicFile.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MediaService {
  constructor(
    private filesService: FilesService,
    private configService: ConfigService,
    @InjectRepository(PublicFile)
    private publicFileRepository: Repository<PublicFile>,
  ) {}
  async create(file: Upload) {
    const path = 'uploads/images';
    await fs.mkdirSync(path, {
      recursive: true,
    });

    const name = file.filename;
    const url = `${path}/${name}`;
    await this.filesService.uploadFile(url, file).catch((err) => {
      throw new BadRequestException(err.message);
    });
    return `${this.configService.get('SERVER_URL')}/files/${url}`;
  }

  async delete(id: number) {
    const media = await this.publicFileRepository.findOne(id);
    if (!media) {
      throw new NotFoundException();
    }
    const url = media.url.split('files/')[1];
    await this.filesService.deleteFile(url);
    await this.publicFileRepository.delete(id);
  }
}
