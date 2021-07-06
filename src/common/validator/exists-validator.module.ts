import { Module } from '@nestjs/common';
import { ExistsValidatorService } from './exists-validator.service';
import { ExistsInDatabaseConstraint } from './exists.validator';

@Module({
  providers: [ExistsValidatorService, ExistsInDatabaseConstraint],
})
export class ExistsValidatorModule {}
