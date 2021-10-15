import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AttemptsController } from './attempts.controller';
import { Attempt, AttemptSchema } from './attempt.schema';
import { CodePlagiat, CodePlagiatSchema } from './evalPlagiat.schema';
import { AttemptsService } from './attempts.service';
import { ChallengesModule } from 'src/challenges/challenges.module';
import { ExecServerModule } from 'src/exec-server/exec-server.module';
import { LanguagesModule } from 'src/languages/languages.module';
import { ExecBootstrapsModule } from 'src/exec-bootstrap/exec-bootstraps.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Attempt.name, schema: AttemptSchema }]),
    MongooseModule.forFeature([{ name: CodePlagiat.name, schema: CodePlagiatSchema }]),
    ChallengesModule,
    ExecServerModule,
    LanguagesModule,
    ExecBootstrapsModule,
  ],
  providers: [AttemptsService],
  exports: [AttemptsService],
  controllers: [AttemptsController],
})
export class AttemptsModule {}
