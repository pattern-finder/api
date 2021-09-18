import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LanguagesModule } from 'src/languages/languages.module';
import { ExecBootstrap, ExecBootstrapSchema } from './exec-bootstrap.schema';
import { ExecBootstrapsController } from './exec-bootstraps.controller';
import { ExecBootstrapsService } from './exec-bootstraps.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ExecBootstrap.name, schema: ExecBootstrapSchema },
    ]),
    LanguagesModule,
  ],
  providers: [ExecBootstrapsService],
  exports: [ExecBootstrapsService],
  controllers: [ExecBootstrapsController],
})
export class ExecBootstrapsModule {}
