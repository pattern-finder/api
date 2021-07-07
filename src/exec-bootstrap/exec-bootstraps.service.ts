import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isMongoId } from 'class-validator';
import { Model } from 'mongoose';
import { FindByIdDTO } from 'src/common/dto/find-by-id.dto';
import { LanguagesService } from 'src/languages/languages.service';
import { FindByChallengeAndLanguageDTO } from './dto/find-by-challenge-and-language.dto';
import { InsertExecBootstrapDTO } from './dto/insert-exec-bootstrap.dto';
import { ListExecBootstrapDTO } from './dto/list-exec-bootstrap.dto';
import { UpdateExecBootstrapDTO } from './dto/update-exec-bootstrap.dto';
import { ExecBootstrap, ExecBootstrapDocument } from './exec-bootstrap.schema';

@Injectable()
export class ExecBootstrapsService {
  constructor(
    @InjectModel(ExecBootstrap.name)
    private readonly execBootstrapModel: Model<ExecBootstrapDocument>,
    private readonly languagesService: LanguagesService,
  ) {}

  async create(
    insertExecBootstrapDTO: InsertExecBootstrapDTO,
  ): Promise<ExecBootstrap> {
    const language = isMongoId(insertExecBootstrapDTO.language)
      ? await this.languagesService.findOne({
          id: insertExecBootstrapDTO.language,
        })
      : await this.languagesService.findByName(insertExecBootstrapDTO.language);

    if (!language) {
      throw new NotFoundException('This language does not exist.');
    }

    const existing = await this.findByLanguageAndChallenge({
      challengeId: insertExecBootstrapDTO.challenge,
      language: insertExecBootstrapDTO.language,
    });

    if (existing !== undefined) {
      throw new ConflictException(
        'This language has already been configured for this challenge. Please use Put route.',
      );
    }

    return (
      await new this.execBootstrapModel({
        ...insertExecBootstrapDTO,
        language: language.name,
      }).save()
    ).toObject();
  }

  async findOne(findExecBootstrapDTO: FindByIdDTO): Promise<ExecBootstrap> {
    const execBootstrap: ExecBootstrap = (
      await this.execBootstrapModel.findById(findExecBootstrapDTO.id).exec()
    )?.toObject();

    if (!execBootstrap) {
      throw new NotFoundException('This execution bootstrap does not exist.');
    }

    return execBootstrap;
  }

  async findByLanguageAndChallenge(
    findExecBootstrapDTO: FindByChallengeAndLanguageDTO,
  ): Promise<ExecBootstrap> {
    const execBootstrap: ExecBootstrap = (
      await this.execBootstrapModel
        .findOne({
          language: findExecBootstrapDTO.language,
          challenge: findExecBootstrapDTO.challengeId.toString(),
        })
        .exec()
    )?.toObject();

    if (!execBootstrap) {
      throw new UnprocessableEntityException(
        'Specified language unavailable for specified challenge.',
      );
    }

    return execBootstrap;
  }

  async findAll(): Promise<ExecBootstrap[]> {
    return (await this.execBootstrapModel.find().exec()).map((execBootstrap) =>
      execBootstrap.toObject(),
    );
  }

  async findExecBootstrapsLanguagesByChallenge(
    findByChallengeDTO: FindByIdDTO,
  ): Promise<ListExecBootstrapDTO[]> {
    const execBootstraps = (
      await this.execBootstrapModel
        .find({ challenge: findByChallengeDTO.id.toString() })
        .exec()
    ).map((execBootstrap) => execBootstrap.toObject());

    return execBootstraps;
  }

  async update(
    updateExecBootstrapDTO: UpdateExecBootstrapDTO,
  ): Promise<ExecBootstrap> {
    return (
      await this.execBootstrapModel
        .findByIdAndUpdate(updateExecBootstrapDTO, {
          ...updateExecBootstrapDTO,
          editedAt: new Date(),
        })
        .exec()
    )?.toObject();
  }
}
