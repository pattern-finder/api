import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { SessionUser } from 'src/auth/dtos/session-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { User, UserDocument } from './user.schema';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  getUser(@Request() req) {
    return req.user;
  }

  @Post()
  async createUser(@Body() userDTO: CreateUserDTO): Promise<User> {
    return this.usersService.create(userDTO);
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  async updateUser(
    @Request() sessionuserObject: SessionUser,
    @Body() updateUserDTO: UpdateUserDTO,
  ) {
    console.log(sessionuserObject);

    return this.usersService.update(sessionuserObject.user.id, updateUserDTO);
  }

  @Get()
  async getUsers(): Promise<UserDocument[]> {
    return this.usersService.findAll();
  }
}
