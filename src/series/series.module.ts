import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Serie, SerieSchema } from './series.schema';
import { SeriesService } from './series.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Serie.name, schema: SerieSchema }]),
  ],
  providers: [SeriesService],
  exports: [SeriesService],
})
export class SeriesModule {}
