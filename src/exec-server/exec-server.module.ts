import { Module } from '@nestjs/common';
import { ObjectStorageModule } from 'src/object-storage/object-storage.module';
import { GodBoxRepository } from './godbox.repository';
import { JudgeZeroRepository } from './judge-zero.repository';

@Module({
  providers: [JudgeZeroRepository, GodBoxRepository, ObjectStorageModule],
  exports: [JudgeZeroRepository, GodBoxRepository],
})
export class ExecServerModule {}
