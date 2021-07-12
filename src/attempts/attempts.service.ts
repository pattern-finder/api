import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FindByIdDTO } from 'src/common/dto/find-by-id.dto';
import { ExecBootstrapsService } from 'src/exec-bootstrap/exec-bootstraps.service';
import { GodBoxRepository } from 'src/exec-server/godbox.repository';
import { Attempt, AttemptDocument } from './attempt.schema';
import { ExecutionResultsDTO } from './dto/execution-results.dto';
import { InsertAttemptDTO } from './dto/insert-attempt.dto';

@Injectable()
export class AttemptsService {
  constructor(
    @InjectModel(Attempt.name)
    private readonly attemptModel: Model<AttemptDocument>,
    private readonly execServerService: GodBoxRepository,
    private readonly execBootstrapService: ExecBootstrapsService,
  ) {}

  async create(
    insertAttemptDTO: InsertAttemptDTO, // link challenge and execbootstrap
  ): Promise<ExecutionResultsDTO> {
    const execBootstrap =
      await this.execBootstrapService.findByLanguageAndChallenge({
        challengeId: insertAttemptDTO.challenge._id,
        language: insertAttemptDTO.language,
      });

    const execResults = await this.execServerService.execute(
      insertAttemptDTO.code,
      execBootstrap,
      insertAttemptDTO.challenge.pictures,
    );

    const attempt = (
      await new this.attemptModel({
        ...execResults,
        ...insertAttemptDTO,
        createdAt: new Date(),
      }).save()
    ).toObject();

    return { ...execResults, id: attempt.id };
  }

  async findOne(findAttemptDTO: FindByIdDTO): Promise<Attempt> {
    const attempt: Attempt = (
      await this.attemptModel.findById(findAttemptDTO.id).exec()
    )?.toObject();

    if (!attempt) {
      throw new NotFoundException('This attempt does not exist.');
    }

    return attempt;
  }

  async findAll(): Promise<Attempt[]> {
    return (await this.attemptModel.find().exec()).map((attempt) =>
      attempt.toObject(),
    );
  }
}