import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ObjectStorageModule } from 'src/object-storage/object-storage.module';
import { CodePlagiat, CodePlagiatSchema } from './evalplagiat.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: CodePlagiat.name, schema: CodePlagiatSchema }]),
    ObjectStorageModule,
  ],
})
export class CodePlagiatModule {}
