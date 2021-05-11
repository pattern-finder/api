import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async findAll(): Promise<UserDocument[]> {
    return await this.userModel.find().exec();
  }

  async findOne(id: string): Promise<UserDocument> {
    return await this.userModel.findById(id).exec();
  }

  async findByUsername(username: string): Promise<UserDocument> {
    return await this.userModel.findOne({ username });
  }

  async create(createUserDTO: CreateUserDTO): Promise<UserDocument> {
    if (await this.findByUsername(createUserDTO.username)) {
      throw new UnprocessableEntityException(
        `Username ${createUserDTO.username} already taken.`,
      );
    }
    return await new this.userModel({
      ...createUserDTO,
      createdAt: new Date(),
    }).save();
  }

  async update(
    id: string,
    updateUserDTO: UpdateUserDTO,
  ): Promise<UserDocument> {
    return await this.userModel.findByIdAndUpdate(id, updateUserDTO).exec();
  }

  async delete(id: string): Promise<UserDocument> {
    return await this.userModel.findByIdAndDelete(id).exec();
  }
}
