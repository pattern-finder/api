import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getHelloTest(): string {
    return 'Hello World! getHelloTest';
  }

  getOK(): string {
    return 'GET Valid!';
  }

  postOK(): string {
    return 'POST Valid!';
  }
}
