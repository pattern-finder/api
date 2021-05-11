import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { SessionUserDTO } from 'src/auth/dtos/session-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateUserDTO } from './dto/create-user.dto';
import { FindUserDTO } from './dto/find-user.dto';
import { SanitizedUserDTO } from './dto/sanitized-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  async getUser(@Param() idObject: FindUserDTO): Promise<SanitizedUserDTO> {
    return await this.usersService.findOne(idObject.id);
  }

  @Post()
  async createUser(@Body() userDTO: CreateUserDTO): Promise<SanitizedUserDTO> {
    return await this.usersService.create(userDTO);
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  async updateUser(
    @Request() req: { user: SessionUserDTO },
    @Body() updateUserDTO: UpdateUserDTO,
  ): Promise<SanitizedUserDTO> {
    if (Object.keys(updateUserDTO).length === 0) {
      throw new BadRequestException('No changes were specified.');
    }
    return this.usersService.update(req.user.userId, updateUserDTO);
  }

  @Get()
  async getUsers(): Promise<SanitizedUserDTO[]> {
    return this.usersService.findAll();
  }
}
