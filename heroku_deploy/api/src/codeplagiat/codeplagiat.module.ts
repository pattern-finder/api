import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CodePlagiat, CodePlagiatSchema } from './codeplagiat.schema';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: CodePlagiat.name, schema: CodePlagiatSchema }]),
  ],

})
export class CodePlagiatModule {}
