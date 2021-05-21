import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { SessionUserDTO } from 'src/auth/dto/session-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateUserDTO } from './dto/create-user.dto';
import { FindByIdDTO } from '../common/dto/find-by-id.dto';
import { SanitizedUserDTO } from './dto/sanitized-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { BufferedFile } from 'src/common/BufferedFile';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  async getUser(@Param() idObject: FindByIdDTO): Promise<SanitizedUserDTO> {
    const user = await this.usersService.findOne(idObject.id);

    if (!user) {
      throw new NotFoundException('User with specified ID does not exist.');
    }

    return user;
  }

  @Post()
  async createUser(@Body() userDTO: CreateUserDTO): Promise<SanitizedUserDTO> {
    return await this.usersService.create(userDTO);
  }

  @UseInterceptors(FileInterceptor('profile_picture'))
  @UseGuards(JwtAuthGuard)
  @Put()
  async updateUser(
    @Request() req: { user: SessionUserDTO },
    @Body() updateUserDTO: UpdateUserDTO,
    @UploadedFile() profilePicture: BufferedFile,
  ): Promise<SanitizedUserDTO> {
    if (Object.keys(updateUserDTO).length === 0 && !profilePicture) {
      throw new BadRequestException('No changes were specified.');
    }
    return this.usersService.update(
      req.user.userId,
      updateUserDTO,
      profilePicture,
    );
  }

  @Get()
  async getUsers(): Promise<SanitizedUserDTO[]> {
    return this.usersService.findAll();
  }
}
