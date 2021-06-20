import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AttemptsController } from './attempts.controller';
import { Attempt, AttemptSchema } from './attempt.schema';
import { AttemptsService } from './attempts.service';
import { ChallengesModule } from 'src/challenges/challenges.module';
import { ExecServerModule } from 'src/exec-server/exec-server.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Attempt.name, schema: AttemptSchema }]),
    ChallengesModule,
    ExecServerModule,
  ],
  providers: [AttemptsService],
  exports: [AttemptsService],
  controllers: [AttemptsController],
})
export class AttemptsModule {}
