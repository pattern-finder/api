import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Serie, SerieDocument } from './series.schema';

@Injectable()
export class SeriesService {
  constructor(
    @InjectModel(Serie.name)
    private readonly seriesModel: Model<SerieDocument>,
  ) {}

  async findAll(): Promise<Serie[]> {
    return (await this.seriesModel.find().exec()).map((serie) =>
      serie.toObject(),
    );
  }

  async findOne(id: string): Promise<Serie> {
    return (await this.seriesModel.findById(id).exec()).toObject();
  }

  async findByName(name: string): Promise<Serie> {
    return await this.seriesModel.findOne({ name });
  }

  async create(createSeriesDTO: CreateSeriesDTO): Promise<Serie> {
    if (await this.findByName(createSeriesDTO.name)) {
      throw new UnprocessableEntityException(
        `Serie name ${createSeriesDTO.name} has already been taken.`,
      );
    }
    return (
      await new this.seriesModel({
        ...createSeriesDTO,
        createdAt: new Date(),
      }).save()
    ).toObject();
  }

  async update(id: string, updateSeriesDTO: UpdateSeriesDTO): Promise<Serie> {
    return (
      await this.seriesModel
        .findByIdAndUpdate(id, { ...updateSeriesDTO, editedAt: new Date() })
        .exec()
    )?.toObject();
  }

  async delete(id: string): Promise<void> {
    await this.seriesModel.findByIdAndDelete(id).exec();
  }
}
