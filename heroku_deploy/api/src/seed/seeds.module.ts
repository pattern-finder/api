import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommandModule } from 'nestjs-command';
import { ChallengesModule } from 'src/challenges/challenges.module';
import { dbConfig } from 'src/db/db.config';
import { ExecBootstrapsModule } from 'src/exec-bootstrap/exec-bootstraps.module';
import { LanguagesModule } from 'src/languages/languages.module';
import { SeriesModule } from 'src/series/series.module';
import { UsersModule } from 'src/users/users.module';
// import { CoursesCommand } from './courses.command';

import { LanguagesCommand } from './languages.command';

@Module({
  imports: [
    MongooseModule.forRoot(dbConfig.url),
    CommandModule,
    forwardRef(() => LanguagesModule),
    forwardRef(() => ChallengesModule),
    forwardRef(() => ExecBootstrapsModule),
    forwardRef(() => SeriesModule),
    forwardRef(() => UsersModule),

  ],
  providers: [LanguagesCommand],
  exports: [LanguagesCommand],
})
export class SeedsModule {}
