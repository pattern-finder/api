import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ObjectStorageModule } from 'src/object-storage/object-storage.module';
import { Picture, PictureSchema } from './picture.schema';
import { PicturesService } from './pictures.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Picture.name, schema: PictureSchema }]),
    ObjectStorageModule,
  ],
  providers: [PicturesService],
  exports: [PicturesService],
})
export class PicturesModule {}
