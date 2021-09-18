import { Module } from '@nestjs/common';
import { ChallengesModule } from 'src/challenges/challenges.module';
import { LanguagesModule } from 'src/languages/languages.module';
import { GodBoxRepository } from './godbox.repository';
import { JudgeZeroRepository } from './judge-zero.repository';

@Module({
  imports: [LanguagesModule, ChallengesModule],
  providers: [JudgeZeroRepository, GodBoxRepository],
  exports: [JudgeZeroRepository, GodBoxRepository],
})
export class ExecServerModule {}
