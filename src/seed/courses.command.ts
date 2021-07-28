import { Injectable } from '@nestjs/common';
import { ChallengesService } from 'src/challenges/challenges.service';

export const DEFAULT_SERIE_NAME = 'Picspy Courses';
@Injectable()
export class CoursesCommand {
  constructor(private readonly challengeService: ChallengesService) {}

  // @Command({
  //   command: 'seed:courses',
  //   describe: 'Fill courses with default challenges in database',
  //   autoExit: true,
  // })
  // async create() {

  // }
}
