import { Module } from '@nestjs/common';
import { LanguagesModule } from 'src/languages/languages.module';
import { GodBoxRepository } from './godbox.repository';
import { JudgeZeroRepository } from './judge-zero.repository';

@Module({
  imports: [LanguagesModule],
  providers: [JudgeZeroRepository, GodBoxRepository],
  exports: [JudgeZeroRepository, GodBoxRepository],
})
export class ExecServerModule {}
