import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ObjectStorageModule } from 'src/object-storage/object-storage.module';
import { Picture, PictureSchema } from './picture.schema';
import { PicturesController } from './pictures.controller';
import { PicturesService } from './pictures.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Picture.name, schema: PictureSchema }]),
    ObjectStorageModule,
  ],
  providers: [PicturesService],
  exports: [PicturesService],
  controllers: [PicturesController],
})
export class PicturesModule {}
