import { HttpException, HttpStatus, Injectable, UnprocessableEntityException } from '@nestjs/common';
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

  public generateInternalServerAddress(endOfLink: string) {
    return `http${config.MINIO_USESSL ? 's' : ''}://${
      config.MINIO_INTERNAL_ENDPOINT
    }/${endOfLink}`;
  }

  public generateExternalServerAddress(endOfLink: string) {
  //  https://minio.picspy.vagahbond.com/minio/picspy-challenges/AyoubTest/c5b3f69c-5222-4623-9993-792f7d8487491627296856152.PNG
    return `http${config.MINIO_USESSL ? 's' : ''}://${
      config.MINIO_EXTERNAL_ENDPOINT
    }/${endOfLink}`;
  }

  private generateFileName(): string {
    return crypto.randomUUID() + Date.now().toString();
  }

  public async upload(
    file: BufferedFile,
    subFolder: string,
    baseBucket: PicspyBucket,
  ): Promise<string> {


    const hashedFileName = this.generateFileName();
    const ext = file.originalname.substring(
      file.originalname.lastIndexOf('.'),
      file.originalname.length,
    );

    const fileName = hashedFileName + ext;
    const filePath = subFolder ? `${subFolder}/${fileName}` : fileName;

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



    return baseBucket.valueOf()
      ? `${baseBucket.valueOf()}/${filePath}`
      : filePath;
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

  async downLoadWithLink(
    downloadPath: string,
    remoteUrl: string,
  ): Promise<void> {
    const urlArray = remoteUrl.split('/');
    const bucket = urlArray[3] as PicspyBucket;
    const filename = urlArray.splice(4).join('/');

    await this.download(downloadPath, filename, bucket);
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
