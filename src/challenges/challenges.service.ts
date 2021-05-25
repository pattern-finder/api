import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Challenge, ChallengeDocument } from './challenge.schema';
import { InsertChallengeDTO } from './dto/insert-challenge.dto';
import { UpdateChallengeDTO } from './dto/update-challenge.dto';

@Injectable()
export class ChallengesService {
  constructor(
    @InjectModel(Challenge.name)
    private readonly challengeModel: Model<ChallengeDocument>,
  ) {}

  async findAll(): Promise<Challenge[]> {
    return (await this.challengeModel.find().exec()).map((challenge) =>
      challenge.toObject(),
    );
  }

  async findOne(id: string): Promise<Challenge> {
    return (await this.challengeModel.findById(id).exec())?.toObject();
  }

  async findByName(name: string): Promise<Challenge> {
    return (await this.challengeModel.findOne({ name }))?.toObject();
  }

  async create(createChallengeDTO: InsertChallengeDTO): Promise<Challenge> {
    if (await this.findByName(createChallengeDTO.name)) {
      throw new UnprocessableEntityException(
        `Challenge name ${createChallengeDTO.name} already taken.`,
      );
    }
    return (
      await new this.challengeModel({
        ...createChallengeDTO,
        createdAt: new Date(),
      }).save()
    ).toObject();
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
