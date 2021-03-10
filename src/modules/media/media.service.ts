import { BadRequestException, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { Upload } from '../shared/classes/upload';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StorageService } from '../shared/services/storage.service';
import { Media } from './models/media.entity';

@Injectable()
export class MediaService {
  constructor(
    private storageService: StorageService,
    private configService: ConfigService,
    @InjectRepository(Media)
    private repository: Repository<Media>,
  ) {}
  async create(file: Upload): Promise<Media> {
    const path = 'uploads/images';

    fs.mkdirSync(path, {
      recursive: true,
    });

    const size = Buffer.byteLength(file.buffer);
    const name = file.filename;
    const url = `${path}/${name}`;
    await this.storageService.uploadFile(url, file).catch((err) => {
      throw new BadRequestException(err.message);
    });
    return this.repository.save(
      this.repository.create({ url, mimetype: file.mimetype, size }),
    );
  }

  //
  // async create1(file: Upload) {
  //   const path = 'uploads/images';
  //   await fs.mkdirSync(path, {
  //     recursive: true,
  //   });
  //
  //   const name = file.filename;
  //   const url = `${path}/${name}`;
  //   await this.filesService.uploadFile(url, file).catch((err) => {
  //     throw new BadRequestException(err.message);
  //   });
  //   return `${this.configService.get('SERVER_URL')}/files/${url}`;
  // }

  async delete(mediaId: number) {
    const media = await this.repository.findOne(mediaId);
    if (!media) {
      throw new BadRequestException('MEDIA_DOES_NOT_EXIST');
    }
    await this.storageService.deleteFile(media.url);
    return this.repository.delete(mediaId);
  }

  // async delete(id: number) {
  //   const media = await this.publicFileRepository.findOne(id);
  //   if (!media) {
  //     throw new NotFoundException();
  //   }
  //   const url = media.url.split('files/')[1];
  //   await this.filesService.deleteFile(url);
  //   await this.publicFileRepository.delete(id);
  // }
}
