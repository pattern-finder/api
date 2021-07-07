import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BufferedFile } from 'src/common/dto/buffered-file.dto';
import { FindByIdDTO } from 'src/common/dto/find-by-id.dto';
import { ExecBootstrapsService } from 'src/exec-bootstrap/exec-bootstraps.service';
import { PicspyBucket } from 'src/object-storage/object-storage.service';
import { PicturesService } from 'src/pictures/pictures.service';
import { Challenge, ChallengeDocument } from './challenge.schema';
import { DetailedChallengeDTO } from './dto/detailed-challenge.dto';
import { InsertChallengeDTO } from './dto/insert-challenge.dto';
import { ListChallengeDTO } from './dto/list-challenge.dto';
import { UpdateChallengeDTO } from './dto/update-challenge.dto';

@Injectable()
export class ChallengesService {
  constructor(
    @InjectModel(Challenge.name)
    private readonly challengeModel: Model<ChallengeDocument>,
    private readonly picturesService: PicturesService,
    private readonly execBootstrapService: ExecBootstrapsService,
  ) {}

  async findAll(): Promise<ListChallengeDTO[]> {
    const challenges = (await this.challengeModel.find().exec()).map(
      (challenge) => challenge.toObject(),
    );

    return await Promise.all(
      challenges.map(async (challenge) => {
        return {
          ...challenge,
          execBootstraps: (
            await this.execBootstrapService.findExecBootstrapsLanguagesByChallenge(
              {
                id: challenge._id,
              },
            )
          ).map((execBootstrap) => execBootstrap),
        };
      }),
    );
  }

  async findOne(findByIdDTO: FindByIdDTO): Promise<DetailedChallengeDTO> {
    const challenge = await (
      await this.challengeModel.findById(findByIdDTO.id).exec()
    )?.toObject();

    if (!challenge) {
      throw new NotFoundException('Speicified challenge does not exists');
    }

    const execBootstraps =
      await this.execBootstrapService.findExecBootstrapsLanguagesByChallenge({
        id: challenge._id,
      });

    return {
      ...challenge,
      pictures: await this.picturesService.findUrlsByChallenge(challenge._id),
      execBootstraps: execBootstraps,
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
          createChallengeDTO.name.replace(' ', '_'),
          PicspyBucket.CHALLENGE,
        ),
      ),
    );

    return challenge;
  }

  async update(updateChallengeDTO: UpdateChallengeDTO): Promise<Challenge> {
    return (
      await this.challengeModel
        .findByIdAndUpdate(updateChallengeDTO.id, {
          ...updateChallengeDTO,
          editedAt: new Date(),
        })
        .exec()
    )?.toObject();
  }

  async delete(id: string): Promise<void> {
    await this.challengeModel.findByIdAndDelete(id).exec();
  }
}
