import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FindByIdDTO } from 'src/common/dto/find-by-id.dto';
import { JudgeZeroRepository } from '../judge-zero/judge-zero.repository';
import { Attempt, AttemptDocument } from './attempt.schema';
import { ExecutionResultsDTO } from './dto/execution-results.dto';
import { FetchedAttemptDTO } from './dto/fetched-attempt.dto';
import { InsertAttemptDTO } from './dto/insert-attempt.dto';

@Injectable()
export class AttemptsService {
  constructor(
    @InjectModel(Attempt.name)
    private readonly attemptModel: Model<AttemptDocument>,
    private readonly judgeZeroRepository: JudgeZeroRepository,
  ) {}

  async create(
    insertAttemptDTO: InsertAttemptDTO,
  ): Promise<ExecutionResultsDTO> {
    const execResults = await this.judgeZeroRepository.execute(
      insertAttemptDTO.code,
      insertAttemptDTO.language,
    );

    const attempt = await new this.attemptModel({
      ...insertAttemptDTO,
      token: execResults.token,
      createdAt: new Date(),
    }).save();

    return { ...execResults, id: attempt.id };
  }

  async findOne(findAttemptDTO: FindByIdDTO): Promise<FetchedAttemptDTO> {
    const attempt: AttemptDocument = await this.attemptModel
      .findById(findAttemptDTO.id)
      .exec();

    const judgeAttempt = await this.judgeZeroRepository.get(attempt.token);
    return {
      ...judgeAttempt,
      user: attempt.user,
      challenge: attempt.challenge,
      code: attempt.code,
      language: attempt.language?.valueOf(),
    };
  }

  async findAll(): Promise<AttemptDocument[]> {
    return await this.attemptModel.find().exec();
  }
}
