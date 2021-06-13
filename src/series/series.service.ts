import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSerieDTO } from './dtos/create-serie.dto';
import { UpdateSerieDTO } from './dtos/update-serie.dto';
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

  async create(createSerieDTO: CreateSerieDTO): Promise<Serie> {
    if (await this.findByName(createSerieDTO.name)) {
      throw new UnprocessableEntityException(
        `Serie name ${createSerieDTO.name} has already been taken.`,
      );
    }
    return (
      await new this.seriesModel({
        ...createSerieDTO,
        createdAt: new Date(),
      }).save()
    ).toObject();
  }

  async update(id: string, updateSerieDTO: UpdateSerieDTO): Promise<Serie> {
    return (
      await this.seriesModel
        .findByIdAndUpdate(id, { ...updateSerieDTO, editedAt: new Date() })
        .exec()
    )?.toObject();
  }

  async delete(id: string): Promise<void> {
    await this.seriesModel.findByIdAndDelete(id).exec();
  }
}
