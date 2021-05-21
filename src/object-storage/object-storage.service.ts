import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
import { BufferedFile } from 'src/common/BufferedFile';
import * as crypto from 'crypto';
import * as path from 'path';
import * as fs from 'fs';

export enum PicspyBucket {
  PROFILE = 'picspy_pps',
  CHALLENGE = 'picspy_challenges',
}

@Injectable()
export default class ObjectStorageService {
  constructor(private readonly minioService: MinioService) {}

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
    const filePath = `${subFolder}/${fileName}`;

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
        `Error uploading file: ${e.code}`,
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
