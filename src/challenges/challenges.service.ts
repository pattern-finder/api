import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Challenge, ChallengeDocument } from './challenge.schema';
import { CreateChallengeDTO } from './dto/create-challenge.dto';
import { UpdateChallengeDTO } from './dto/update-challenge.dto';

@Injectable()
export class ChallengesService {
  constructor(
    @InjectModel(Challenge.name)
    private readonly challengeModel: Model<ChallengeDocument>,
  ) {}

  async findAll(): Promise<ChallengeDocument[]> {
    return await this.challengeModel.find().exec();
  }

  async findOne(id: string): Promise<ChallengeDocument> {
    return await this.challengeModel.findById(id).exec();
  }

  async findByName(name: string): Promise<ChallengeDocument> {
    return await this.challengeModel.findOne({ name });
  }

  async create(
    createChallengeDTO: CreateChallengeDTO,
  ): Promise<ChallengeDocument> {
    if (await this.findByName(createChallengeDTO.name)) {
      throw new UnprocessableEntityException(
        `Challengename ${createChallengeDTO.name} already taken.`,
      );
    }
    return await new this.challengeModel({
      ...createChallengeDTO,
      createdAt: new Date(),
    }).save();
  }

  async update(
    id: string,
    updateChallengeDTO: UpdateChallengeDTO,
  ): Promise<ChallengeDocument> {
    return await this.challengeModel
      .findByIdAndUpdate(id, updateChallengeDTO)
      .exec();
  }

  async delete(id: string): Promise<ChallengeDocument> {
    return await this.challengeModel.findByIdAndDelete(id).exec();
  }
}
