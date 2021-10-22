import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChallengesService } from 'src/challenges/challenges.service';
import { InsertSerieDTO } from './dtos/insert-serie.dto';
import { PopulatedUpdateSerieDTO } from './dtos/populated-update-series.dto';
import { SanitizedSerieDTO } from './dtos/sanitized-serie.dto';
import { Serie, SerieDocument } from './series.schema';

@Injectable()
export class SeriesService {
  constructor(
    @InjectModel(Serie.name)
    private readonly seriesModel: Model<SerieDocument>,
    private readonly challengesService: ChallengesService,
  ) {}

  async findAll(): Promise<Serie[]> {
    return (await this.seriesModel.find().exec()).map((serie) =>
      serie.toObject(),
    );
  }

  async findOne(id: string): Promise<SanitizedSerieDTO> {
    const serie = (await this.seriesModel.findById(id).exec())?.toObject();

    if (!serie) {
      throw new NotFoundException(`Could not find Serie with id: ${id}.`);
    }

    const challenges = await Promise.all(
      serie.challenges.map((c) => {
        return this.challengesService.findOne({ id: c });
      }),
    );

    return {
      ...serie,
      challenges,
    };
  }

  async findByName(name: string): Promise<SerieDocument> {
    return await this.seriesModel.findOne({ name });
  }

  async findDefaultSeries(): Promise<Serie[]> {
    return (await this.seriesModel.find({ name: "default" }).exec()).map((a) =>
      a.toObject(),
    );
  }

  async create(createSerieDTO: InsertSerieDTO): Promise<Serie> {



    if (await this.findByName(createSerieDTO.name)) {

      throw new UnprocessableEntityException(
        `Serie name ${createSerieDTO.name} has already been taken.`,
      );
    }
    return (
      await new this.seriesModel({
        ...createSerieDTO,
        isCourse: true,
        createdAt: new Date(),
      }).save()
    ).toObject();
  }

  async update(
    id: string,
    updateSerieDTO: PopulatedUpdateSerieDTO,
  ): Promise<void> {
    if (updateSerieDTO.name && (await this.findByName(updateSerieDTO.name))) {
      throw new UnprocessableEntityException(
        `Serie name ${updateSerieDTO.name} has already been taken.`,
      );
    }

    await this.seriesModel
      .updateOne(
        { _id: id },
        {
          ...updateSerieDTO,
          editedAt: new Date(),
        },
      )
      .exec();
  }

  async delete(id: string): Promise<void> {
    await this.seriesModel.findByIdAndDelete(id).exec();
  }
}
