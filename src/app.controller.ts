import { Body, Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
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
  testPost(@Body() username: String): string {
    console.log(username);
    return this.appService.postOK();
  }

}
