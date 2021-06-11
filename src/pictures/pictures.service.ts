import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BufferedFile } from 'src/common/dto/buffered-file.dto';
import ObjectStorageService, {
  PicspyBucket,
} from 'src/object-storage/object-storage.service';
import { InsertPictureDTO } from './dto/insert-picture.dto';
import { UpdatePictureDTO } from './dto/update-picture.dto';
import { Picture, PictureDocument } from './picture.schema';

Injectable();
export class PicturesService {
  constructor(
    @InjectModel(Picture.name)
    private readonly pictureModel: Model<PictureDocument>,
    private readonly objectStorageService: ObjectStorageService,
  ) {}

  async findAll(): Promise<Picture[]> {
    return (await this.pictureModel.find().exec()).map((picture) =>
      picture.toObject(),
    );
  }

  async findOne(id: string): Promise<Picture> {
    return (await this.pictureModel.findById(id).exec())?.toObject();
  }

  async findByName(filename: string): Promise<Picture> {
    return (await this.pictureModel.findOne({ filename }))?.toObject();
  }

  async create(
    createPictureDTO: InsertPictureDTO,
    file: BufferedFile,
    subfolderName: string,
    baseBucket: PicspyBucket,
  ): Promise<Picture> {
    const filename = await this.objectStorageService.upload(
      file,
      subfolderName,
      baseBucket,
    ); // setup a types enum for different types of pics.

    if (await this.findByName(filename)) {
      throw new InternalServerErrorException(
        `Picture name ${filename} already taken.`,
      );
    }
    return (
      await new this.pictureModel({
        ...createPictureDTO,
        createdAt: new Date(),
      }).save()
    ).toObject();
  }

  async update(
    id: string,
    updatePictureDTO: UpdatePictureDTO,
  ): Promise<Picture> {
    return (
      await this.pictureModel
        .findByIdAndUpdate(id, { ...updatePictureDTO, editedAt: new Date() })
        .exec()
    )?.toObject();
  }

  async delete(id: string): Promise<void> {
    await this.pictureModel.findByIdAndDelete(id).exec();
  }
}
