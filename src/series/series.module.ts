import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChallengesModule } from 'src/challenges/challenges.module';
import { SeriesController } from './series.controller';
import { Serie, SerieSchema } from './series.schema';
import { SeriesService } from './series.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Serie.name, schema: SerieSchema }]),
    ChallengesModule,
  ],
  providers: [SeriesService],
  exports: [SeriesService],
  controllers: [SeriesController],
})
export class SeriesModule {}
