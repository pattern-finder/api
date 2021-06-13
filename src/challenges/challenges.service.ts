import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BufferedFile } from 'src/common/dto/buffered-file.dto';
import { PicspyBucket } from 'src/object-storage/object-storage.service';
import { PicturesService } from 'src/pictures/pictures.service';
import { Challenge, ChallengeDocument } from './challenge.schema';
import { EagerChallengeDTO } from './dto/eager-challenge.dto';
import { InsertChallengeDTO } from './dto/insert-challenge.dto';
import { UpdateChallengeDTO } from './dto/update-challenge.dto';

@Injectable()
export class ChallengesService {
  constructor(
    @InjectModel(Challenge.name)
    private readonly challengeModel: Model<ChallengeDocument>,
    private readonly picturesService: PicturesService,
  ) {}

  async findAll(): Promise<Challenge[]> {
    return (await this.challengeModel.find().exec()).map((challenge) =>
      challenge.toObject(),
    );
  }

  async findOne(id: string): Promise<EagerChallengeDTO> {
    const challenge = await (
      await this.challengeModel.findById(id).exec()
    ).toObject();

    return {
      ...challenge,
      pictures: await this.picturesService.findUrlsByChallenge(challenge._id),
    };
  }

  async findByName(name: string): Promise<Challenge> {
    return (await this.challengeModel.findOne({ name }))?.toObject();
  }

  async create(
    createChallengeDTO: InsertChallengeDTO,
    files: BufferedFile[],
  ): Promise<Challenge> {
    if (await this.findByName(createChallengeDTO.name)) {
      throw new UnprocessableEntityException(
        `Challenge name ${createChallengeDTO.name} already taken.`,
      );
    }

    const challenge = (
      await new this.challengeModel({
        ...createChallengeDTO,
        createdAt: new Date(),
      }).save()
    ).toObject();

    await Promise.all(
      files.map((file) =>
        this.picturesService.create(
          { challenge: challenge._id },
          file,
          '',
          PicspyBucket.CHALLENGE,
        ),
      ),
    );

    return challenge;
  }

  async update(
    id: string,
    updateChallengeDTO: UpdateChallengeDTO,
  ): Promise<Challenge> {
    return (
      await this.challengeModel
        .findByIdAndUpdate(id, { ...updateChallengeDTO, editedAt: new Date() })
        .exec()
    )?.toObject();
  }

  async delete(id: string): Promise<void> {
    await this.challengeModel.findByIdAndDelete(id).exec();
  }
}
