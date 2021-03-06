import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FindByIdDTO } from 'src/common/dto/find-by-id.dto';
import { InsertLanguageDTO } from './dto/insert-language.dto';
import { Language, LanguageDocument } from './language.schema';

@Injectable()
export class LanguagesService {
  constructor(
    @InjectModel(Language.name)
    private readonly languageModel: Model<LanguageDocument>,
  ) {}

  async create(insertLanguageDTO: InsertLanguageDTO): Promise<Language> {
    if (await this.findByName(insertLanguageDTO.name)) {
      throw new UnprocessableEntityException(
        `Language name ${insertLanguageDTO.name} already taken.`,
      );
    }

    return (await new this.languageModel(insertLanguageDTO).save()).toObject();
  }

  async findByName(name: string): Promise<Language> {
    return (await this.languageModel.findOne({ name }))?.toObject();
  }

  async findOne(findLanguageDTO: FindByIdDTO): Promise<Language> {
    return (
      await this.languageModel.findById(findLanguageDTO.id).exec()
    )?.toObject();
  }

  async deleteAll(): Promise<void> {
    await this.languageModel.deleteMany({}).exec();
  }

  async findAll(): Promise<Language[]> {
    return (await this.languageModel.find().exec()).map((language) =>
      language.toObject(),
    );
  }
}
