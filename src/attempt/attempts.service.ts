import { Injectable, NotFoundException } from '@nestjs/common';
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

    const attempt = (
      await new this.attemptModel({
        ...insertAttemptDTO,
        token: execResults.token,
        createdAt: new Date(),
      }).save()
    ).toObject();

    return { ...execResults, id: attempt.id };
  }

  async findOne(findAttemptDTO: FindByIdDTO): Promise<FetchedAttemptDTO> {
    const attempt: Attempt = (
      await this.attemptModel.findById(findAttemptDTO.id).exec()
    )?.toObject();

    if (!attempt) {
      throw new NotFoundException('This attempt does not exist.');
    }

    const judgeAttempt = await this.judgeZeroRepository.get(attempt.token);
    return {
      ...judgeAttempt,
      user: attempt.user,
      challenge: attempt.challenge,
      code: attempt.code,
      language: attempt.language?.valueOf(),
    };
  }

  async findAll(): Promise<Attempt[]> {
    return (await this.attemptModel.find().exec()).map((attempt) =>
      attempt.toObject(),
    );
  }
}
