import { Module } from '@nestjs/common';
import { MinioModule } from 'nestjs-minio-client';
import ObjectStorageService from './object-storage.service';
import { config } from './object-storage.config';
@Module({
  imports: [
    MinioModule.register({
      endPoint: config.MINIO_ENDPOINT,
      port: config.MINIO_PORT,
      useSSL: config.MINIO_USESSL,
      accessKey: config.MINIO_ACCESSKEY,
      secretKey: config.MINIO_SECRETKEY,
      region: config.MINIO_REGION,
    }),
  ],
  providers: [ObjectStorageService],
  exports: [ObjectStorageService],
})
export class ObjectStorageModule {}
