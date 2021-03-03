import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PublicFile } from '../entities/publicFile.entity';
import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';
import * as fs from 'fs';
import { Upload } from '../entities/upload';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(PublicFile)
    private publicFilesRepository: Repository<PublicFile>,
    private readonly configService: ConfigService,
  ) {}

  async uploadPublicFile(data: Buffer, filename: string) {
    const s3 = new S3();
    const uploadResult = await s3
      .upload({
        Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
        Body: data,
        Key: `${uuid()}-${filename}`,
      })
      .promise();
    return this.saveUploadResult(uploadResult);
  }

  async saveUploadResult(uploadResult: { Key?: string; Location: string }) {
    const newFile = await this.publicFilesRepository.create({
      key: uploadResult?.Key || '',
      url: uploadResult.Location,
    });
    return this.publicFilesRepository.save(newFile);
  }

  async deletePublicFile(key: string) {
    const s3 = new S3();
    await s3
      .deleteObject({
        Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
        Key: key,
      })
      .promise();
    await this.publicFilesRepository.delete({
      key,
    });
  }

  async uploadFile(name: string, file: Upload): Promise<string> {
    return new Promise((resolve, reject) => {
      fs.writeFile(name, file.buffer, (err) => {
        if (err) {
          reject({ message: 'STORAGE_UPLOAD_ERROR' });
        }
        resolve(name);
      });
    });
  }

  async deleteFile(path: string): Promise<string> {
    return new Promise((resolve, reject) => {
      fs.unlink(path, (err) => {
        if (err) {
          reject({ message: 'STORAGE_DELETE_ERROR' });
        }
        resolve(path);
      });
    });
  }
}
