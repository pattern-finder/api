import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test/get')
  testGet(): string {
    return this.appService.getOK();
  }

  @Post('test/post')
  testPost(@Body() username: string): string {
    console.log(username);
    return this.appService.postOK();
  }
}
