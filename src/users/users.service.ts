import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BufferedFile } from 'src/common//dto/buffered-file.dto';
import { encrypt } from 'src/common/crypt.handler';
import ObjectStorageService, {
  PicspyBucket,
} from 'src/object-storage/object-storage.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly objectStorageService: ObjectStorageService,
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
      password: await encrypt(createUserDTO.password),
    }).save();
  }

  async update(
    id: string,
    updateUserDTO: UpdateUserDTO,
    file?: BufferedFile,
  ): Promise<UserDocument> {
    // TODO : create DTOs for updates, with the editedAt field specified ?
    const userObject: {
      password?: string;
      avatarUrl?: string;
      editedAt: Date;
    } = {
      ...updateUserDTO,
      editedAt: new Date(),
    };

    if (updateUserDTO.password) {
      userObject.password = await encrypt(updateUserDTO.password);
    }

    if (file) {
      userObject.avatarUrl = await this.objectStorageService.upload(
        file,
        'raw',
        PicspyBucket.PROFILE,
      );
    }

    return await this.userModel.findByIdAndUpdate(id, userObject).exec();
  }

  async delete(id: string): Promise<UserDocument> {
    return await this.userModel.findByIdAndDelete(id).exec();
  }
}
