import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommandModule } from 'nestjs-command';
import { dbConfig } from 'src/db/db.config';
import { LanguagesModule } from 'src/languages/languages.module';

import { LanguagesCommand } from './languages.command';

@Module({
  imports: [
    MongooseModule.forRoot(dbConfig.url),
    CommandModule,
    LanguagesModule,
  ],
  providers: [LanguagesCommand],
  exports: [LanguagesCommand],
})
export class SeedsModule {}
