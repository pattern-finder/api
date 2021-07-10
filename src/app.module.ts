import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ChallengesModule } from './challenges/challenges.module';
import { AttemptsModule } from './attempts/attempts.module';
import { SeriesModule } from './series/series.module';
import { dbConfig } from './db/db.config';
import { LanguagesModule } from './languages/languages.module';
import { ExecBootstrapsModule } from './exec-bootstrap/exec-bootstraps.module';
import { PicturesModule } from './pictures/pictures.module';
@Module({
  imports: [
    MongooseModule.forRoot(dbConfig.url),
    UsersModule,
    AuthModule,
    ChallengesModule,
    AttemptsModule,
    SeriesModule,
    LanguagesModule,
    ExecBootstrapsModule,
    PicturesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
