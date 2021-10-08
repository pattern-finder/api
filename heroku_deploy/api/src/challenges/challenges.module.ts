import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExecBootstrapsModule } from 'src/exec-bootstrap/exec-bootstraps.module';
import { PicturesModule } from 'src/pictures/pictures.module';
import { Challenge, ChallengeSchema } from './challenge.schema';
import { ChallengesController } from './challenges.controller';
import { ChallengesService } from './challenges.service';

@Module({
  controllers: [ChallengesController],
  imports: [
    MongooseModule.forFeature([
      { name: Challenge.name, schema: ChallengeSchema },
    ]),
    PicturesModule,
    ExecBootstrapsModule,
  ],
  providers: [ChallengesService],
  exports: [ChallengesService],
})
export class ChallengesModule {}
