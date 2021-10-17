
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EvalPlagiat, EvalPlagiatDocument } from './evalPlagiat.schema';
import { CreateCatDto } from './dto/create-evalPlagiat.dto';

@Injectable()
export class EvalPlagiatService {
  
  constructor(@InjectModel(EvalPlagiat.name) private catModel: Model<EvalPlagiatDocument>) {}

  async create(createCatDto: CreateCatDto): Promise<EvalPlagiat> {
    const createdCat = new this.catModel(createCatDto);
    return createdCat.save();
  }

  async findAll(): Promise<EvalPlagiat[]> {
    return this.catModel.find().exec();
  }
}

