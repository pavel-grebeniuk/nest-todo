import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

import { plainToClass } from 'class-transformer';
import { isObject as _isObject } from 'lodash';
import { WritableStreamBuffer } from 'stream-buffers';
import { Upload } from '../entities/upload';

async function transformUploadFile(valueOrPromise) {
  const file = await Promise.resolve(valueOrPromise);
  if (!(valueOrPromise instanceof Promise) || !file.createReadStream) {
    return file;
  }

  const buffer = await new Promise<WritableStreamBuffer>(
    (resolve, reject): any => {
      const buf = new WritableStreamBuffer({ defaultEncoding: file.encoding });

      file
        .createReadStream()
        .pipe(buf)
        .on('error', () => {
          return reject({ message: 'Read Error' });
        })
        .on('finish', () => {
          return resolve(buf);
        });
    },
  );

  return plainToClass(Upload, {
    buffer: buffer.getContents(),
    encoding: file.encoding,
    filename: file.filename,
    mimetype: file.mimetype,
  });
}

async function getPromiseValues(value) {
  switch (true) {
    case value instanceof Promise: {
      value = await transformUploadFile(value);
      break;
    }
    case Array.isArray(value): {
      value = await Promise.all(value.map((el) => getPromiseValues(el)));
      break;
    }
    case _isObject(value): {
      for (const field in value) {
        if (value[field]) {
          value[field] = await getPromiseValues(value[field]);
        }
      }
      break;
    }
  }
  return value;
}

@Injectable()
export class TransformUploadPipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type !== 'body') {
      return value;
    }
    return await getPromiseValues(value);
  }
}
