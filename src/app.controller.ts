import { Controller, Get, Request, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { UsersService } from './users/users.service';

@Controller()
export class AppController {
  constructor(private authService: AuthService, private UsersService: UsersService) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(LocalAuthGuard)
  @Post('user/create')
  async createUser(@Request() req) {
    return this.UsersService.addOne(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('user/update')
  async updateUser(@Request() req) {

    return this.UsersService.updateOne(req.user, req.body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
