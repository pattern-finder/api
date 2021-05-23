import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
import { BufferedFile } from 'src/common/dto/buffered-file.dto';
import * as crypto from 'crypto';
import * as path from 'path';
import * as fs from 'fs';
import { config } from './object-storage.config';

export enum PicspyBucket {
  PROFILE = 'picspy-pps',
  CHALLENGE = 'picspy-challenges',
}

@Injectable()
export default class ObjectStorageService {
  constructor(private readonly minioService: MinioService) {}

  public static generateServerAddress(endOfLink: string) {
    `http${config.MINIO_USESSL && 's'}://${config.MINIO_ENDPOINT}:${
      config.MINIO_PORT
    }/${endOfLink}`;
  }

  public async upload(
    file: BufferedFile,
    subFolder: string,
    baseBucket: PicspyBucket,
  ): Promise<string> {
    const hashedFileName = crypto
      .createHash('md5')
      .update(Date.now().toString())
      .digest('hex');
    const ext = file.originalname.substring(
      file.originalname.lastIndexOf('.'),
      file.originalname.length,
    );
    const fileName = hashedFileName + ext;
    const filePath = `${baseBucket.valueOf()}/${subFolder}/${fileName}`;

    const metaData = {
      'Content-Type': file.mimetype,
    };

    try {
      await this.minioService.client.putObject(
        baseBucket.valueOf(),
        filePath,
        file.buffer,
        metaData,
      );
    } catch (e) {
      throw new HttpException(
        `Error uploading file: ${e}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return filePath;
  }

  delete(objetName: string, baseBucket: PicspyBucket): void {
    try {
      this.minioService.client.removeObject(baseBucket.valueOf(), objetName);
    } catch {
      throw new HttpException(
        'Error deleting file',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async download(
    downloadPath: string,
    objetName: string,
    baseBucket: PicspyBucket,
  ): Promise<void> {
    try {
      const basedir = path.dirname(downloadPath);
      fs.mkdirSync(basedir, {
        recursive: true,
      });

      return this.minioService.client.fGetObject(
        baseBucket.valueOf(),
        objetName,
        downloadPath,
      );
    } catch {
      throw new HttpException(
        'Error getting file',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
