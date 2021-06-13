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
import {
  SanitizedUserDTO,
  sanitizedUserTemplate,
} from './dto/sanitized-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { BufferedFile } from 'src/common/dto/buffered-file.dto';
import { LinkifyInterceptor } from 'src/common/responses/linkify.interceptor';
import { sanitize } from 'src/common/responses/generic_sanitizer';
import { User } from './user.schema';

@UseInterceptors(LinkifyInterceptor)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  async getUser(@Param() idObject: FindByIdDTO): Promise<SanitizedUserDTO> {
    const user = await this.usersService.findOne(idObject.id);

    if (!user) {
      throw new NotFoundException('User with specified ID does not exist.');
    }

    return sanitize<SanitizedUserDTO>(user, sanitizedUserTemplate);
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
  ): Promise<User> {
    if (Object.keys(updateUserDTO).length === 0 && !profilePicture) {
      throw new BadRequestException('No changes were specified.');
    }
    const user = this.usersService.update(
      req.user.userId,
      updateUserDTO,
      profilePicture,
    );

    return user;
  }

  @Get()
  async getUsers(): Promise<SanitizedUserDTO[]> {
    return (await this.usersService.findAll()).map((user) =>
      sanitize<SanitizedUserDTO>(user, sanitizedUserTemplate),
    );
  }
}
