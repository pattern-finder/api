
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EvalPlagiat, EvalPlagiatDocument } from './evalPlagiat.schema';
import { CreateCatDto } from './dto/create-evalPlagiat.dto';

@Injectable()
export class EvalPlagiatService {
  
  constructor(@InjectModel(EvalPlagiat.name) private evalPlagiatModel: Model<EvalPlagiatDocument>) {}

  async create(createCatDto: CreateCatDto): Promise<EvalPlagiat> {
    const createdCat = new this.evalPlagiatModel(createCatDto);
    return createdCat.save();
  }

  async findAll(): Promise<EvalPlagiat[]> {
    return this.evalPlagiatModel.find().exec();
  }

  async find(plagiatCodeDto : CreateCatDto): Promise<EvalPlagiat[]> {
    return this.evalPlagiatModel.find({
      userId: {$ne: plagiatCodeDto.userId},
      tokenCode:plagiatCodeDto.tokenCode, 
      nameExo:plagiatCodeDto.nameExo, 

      })
  }
}

