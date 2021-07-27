import { Module } from '@nestjs/common';
import { AttemptsModule } from 'src/attempts/attempts.module';
import { ChallengesModule } from 'src/challenges/challenges.module';
import { SeriesModule } from 'src/series/series.module';
import { UserStatsController } from './user-stats.controller';
import { UserStatsService } from './user-stats.service';

@Module({
  controllers: [UserStatsController],
  imports: [AttemptsModule, ChallengesModule, SeriesModule],
  providers: [UserStatsService],
  exports: [UserStatsService],
})
export class UserStatsModule {}
