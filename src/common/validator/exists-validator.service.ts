import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class ExistsValidatorService {
  constructor(@InjectConnection() private connection: Connection) {}

  getConnextion(): Connection {
    return this.connection;
  }
}
