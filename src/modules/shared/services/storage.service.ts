import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

import { Upload } from '../classes/upload';

@Injectable()
export class StorageService {
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
