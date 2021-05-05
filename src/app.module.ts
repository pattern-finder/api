import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
@Module({
  imports: [
    MongooseModule.forRoot(
      `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@picspy-mongo:${process.env.MONGO_PORT}`,
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
