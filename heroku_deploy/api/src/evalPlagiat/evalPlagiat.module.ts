
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EvalPlagiatService } from './evalPlagiat.service';
import { EvalPlagiat, EvalPlagiatSchema } from './evalPlagiat.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: EvalPlagiat.name, schema: EvalPlagiatSchema }])],
  providers: [EvalPlagiatService],
  exports: [EvalPlagiatService],
})
export class CatsModule {}
