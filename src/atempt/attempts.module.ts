import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { JudgeZeroRepository } from "src/judge-zero/judge-zero.repository";
import { AttemptsController } from "./attempts.controller";
import { Attempt, AttemptSchema } from "./attempt.schema";
import { AttemptsService } from "./attempts.service";
import { ChallengesService } from "src/challenges/challenges.service";
import { ChallengesModule } from "src/challenges/challenges.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Attempt.name, schema: AttemptSchema }]),
    ChallengesModule,
  ],
  providers: [JudgeZeroRepository, AttemptsService],
  exports: [AttemptsService],
  controllers: [AttemptsController],
})
export class AttemptsModule {}
