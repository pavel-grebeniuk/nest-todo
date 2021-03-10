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
      this.repository.create({
        url,
        mimetype: file.mimetype,
        size,
        fileName: name,
      }),
    );
  }

  async delete(images: Media[]) {
    for await (const { url } of images) {
      await this.storageService.deleteFile(url);
    }
  }
}
