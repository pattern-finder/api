import {
  Controller,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateUserDTO } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('')
  async createUser(@Param() req: CreateUserDTO) {
    return this.usersService.create(req);
  }

  @UseGuards(JwtAuthGuard)
  @Put('')
  async updateUser(@Request() req) {
    return this.usersService.update(req.user, req.body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('')
  getProfile(@Request() req) {
    return req.user;
  }
}
