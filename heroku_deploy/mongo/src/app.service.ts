import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHome(): string {
    return 'Welcome to PicSpy API !';
  }
}
