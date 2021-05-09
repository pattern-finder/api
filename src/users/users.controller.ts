import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { UsersService } from './users.service';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(LocalAuthGuard)
  @Post('create')
  async createUser(@Request() req) {
    return this.usersService.addOne(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('update')
  async updateUser(@Request() req) {
    return this.usersService.updateOne(req.user, req.body);
  }


  //curl -X POST http://localhost:3000/user/sendCode -d '{"code": "echo hello world"}' -H "Content-Type: application/json"  
  @UseGuards(JwtAuthGuard)
  @Post('systeme/getToken')
  async getToken(@Request() req) {
      return this.usersService.getToken(req.body);
  }

  //curl -X POST http://localhost:3000/systeme/getCompile -d '{"token": "TOKEN"}' -H "Content-Type: application/json"
  @UseGuards(JwtAuthGuard)
  @Post('systeme/getCompile')
  async getCompile(@Request() req) {
    return this.usersService.getCompile(req.body);
  }


  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
