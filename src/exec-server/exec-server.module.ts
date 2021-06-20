import { Module } from '@nestjs/common';
import { GodBoxRepository } from './godbox.repository';
import { JudgeZeroRepository } from './judge-zero.repository';

@Module({
  providers: [JudgeZeroRepository, GodBoxRepository],
  exports: [JudgeZeroRepository, GodBoxRepository],
})
export class ExecServerModule {}
