import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CodePlagiat, CodePlagiatSchema } from './codeplagiat.schema';
import { CodePlagiatService } from './codeplagiat.service';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: CodePlagiat.name, schema: CodePlagiatSchema }]),
  ],
  providers: [CodePlagiatService],
  exports: [CodePlagiatService],
})

export class CodePlagiatModule {}
