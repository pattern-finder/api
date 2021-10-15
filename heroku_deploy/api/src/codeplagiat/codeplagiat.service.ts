import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CodePlagiat, CodePlagiatDocument } from './codeplagiat.schema';

@Injectable()
export class CodePlagiatService {
  constructor(
    @InjectModel(CodePlagiat.name)
    private readonly codePlagiatModel: Model<CodePlagiatDocument>,
  ) {}


  async findAll(): Promise<CodePlagiat[]> {
    return (await this.codePlagiatModel.find().exec()).map((language) =>
      language.toObject(),
    );
  }
}
