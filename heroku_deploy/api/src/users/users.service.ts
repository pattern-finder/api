import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BufferedFile } from 'src/common/dto/buffered-file.dto';
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

  async findAll(): Promise<User[]> {
    return (await this.userModel.find().exec()).map((user) => {
      const userObject = user.toObject();
      return {
        ...userObject,
        avatarUrl:
          userObject.avatarUrl &&
          this.objectStorageService.generateExternalServerAddress(
            userObject.avatarUrl,
          ),
      };
    });
  }

  async findOne(id: string): Promise<User> {
    const userObject = (await this.userModel.findById(id).exec())?.toObject();

    if (!userObject) {
      throw new NotFoundException(`User: ${id} does not exist.`);
    }

    return {
      ...userObject,
      avatarUrl:
        userObject.avatarUrl &&
        this.objectStorageService.generateExternalServerAddress(
          userObject.avatarUrl,
        ),
    };
  }

  async findByUsername(username: string): Promise<User> {
    return await (await this.userModel.findOne({ username }))?.toObject();
  }

  async create(
    createUserDTO: CreateUserDTO,
    file?: BufferedFile,
  ): Promise<User> {
    if (await this.findByUsername(createUserDTO.username)) {
      throw new UnprocessableEntityException(
        `Username ${createUserDTO.username} already taken.`,
      );
    }

    let avatarUrl = undefined;
    if (await this.findByUsername(createUserDTO.username)) {
      throw new UnprocessableEntityException(
        `Username ${createUserDTO.username} already taken.`,
      );
    }
    
    if (file) {
      avatarUrl = await this.objectStorageService.upload(
        file,
        'raw',
        PicspyBucket.PROFILE,
      );
    }

    return (
      await new this.userModel({
        ...createUserDTO,
        createdAt: new Date(),
        password: await encrypt(createUserDTO.password),
        avatarUrl,
      }).save()
    ).toObject();
  }

  async update(
    id: string,
    updateUserDTO: UpdateUserDTO,
    file?: BufferedFile,
  ): Promise<User> {
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

    return (
      await this.userModel.findByIdAndUpdate(id, userObject).exec()
    )?.toObject();
  }

  async delete(id: string): Promise<void> {
    await this.userModel.findByIdAndDelete(id).exec();
  }
}
