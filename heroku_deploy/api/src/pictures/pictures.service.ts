import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BufferedFile } from 'src/common/dto/buffered-file.dto';
import { FindByIdDTO } from 'src/common/dto/find-by-id.dto';
import ObjectStorageService, {
  PicspyBucket,
} from 'src/object-storage/object-storage.service';
import { InsertPictureDTO } from './dto/insert-picture.dto';
import { PictureUrlDTO } from './dto/picture-url.dto';
import { UpdatePictureDTO } from './dto/update-picture.dto';
import { Picture, PictureDocument } from './picture.schema';
import { Types } from 'mongoose';

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

  async findOne(idObject: FindByIdDTO): Promise<Picture> {
    return (await this.pictureModel.findById(idObject.id).exec())?.toObject();
  }

  async findByName(filename: string): Promise<Picture> {
    return (await this.pictureModel.findOne({ filename }))?.toObject();
  }

  async findExternalUrlsByChallenge(
    challenge: string,
    fromInternal = false,
  ): Promise<PictureUrlDTO[]> {
  //  console.log("findExternalUrlsByChallenge OK")
   // console.log(this.objectStorageService)
  //  console.log("objectStorageService ci dessus")
  const id_challenge = Types.ObjectId(challenge)
  const picturesList = (await this.pictureModel.find().exec()).map((picture) =>{
  //  console.log("picture.challenge OK")
  //  console.log(picture.challenge)
   // console.log("challenge OK")
    //console.log(challenge)
   // console.log("findExternalUrlsByChallenge OK")
   console.log(typeof id_challenge)
   console.log(typeof picture.challenge)
   // if (picture.challenge == id_challenge){
        console.log("INSERT")
        picture.toObject();
   // }
  }
  )


  console.log("Challenge LIST ci dessous v11")

  console.log(picturesList)

  const pictures = (
    await this.pictureModel.find({ id_challenge }).exec()
  ).map((picture) => {
        console.log("pictureObject")
        const pictureObject = picture.toObject();
        console.log(pictureObject)

        const file = fromInternal

          ? this.objectStorageService.generateInternalServerAddress(
              pictureObject.url,
            )
          : this.objectStorageService.generateExternalServerAddress(
              pictureObject.url,
            );
          console.log("findExternalUrlsByChallenge END 1 return")

        return {
          _id: pictureObject._id,
          file: file,
          execFileName: pictureObject.execFileName,
        };
      },
    );



    console.log(pictures)
    console.log("findExternalUrlsByChallenge END 2nd return")
    return pictures;
  }

  async findInternalUrlsByChallenge(
    challenge: string,
  ): Promise<PictureUrlDTO[]> {
    const pictures = (
      await this.pictureModel.find({ challenge }, 'url').exec()
    ).map((picture) => {
      const pictureObject = picture.toObject();
      return {
        _id: pictureObject._id,
        file: this.objectStorageService.generateInternalServerAddress(
          pictureObject.url,
        ),
        execFileName: pictureObject.execFileName,
      };
    });
    return pictures;
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
        url: filename,
        execFileName: file.originalname,
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

  async delete(id: FindByIdDTO, baseBucket: PicspyBucket): Promise<void> {
    const picture = await this.findOne(id);

    if (!picture) {
      throw new NotFoundException(`Could not delete picture with ID: ${id}`);
    }

    await this.objectStorageService.delete(picture.url, baseBucket);
    await this.pictureModel.findByIdAndDelete(id.id).exec();
  }
}
