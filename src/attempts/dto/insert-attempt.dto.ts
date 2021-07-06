import { DetailedChallengeDTO } from 'src/challenges/dto/detailed-challenge.dto';

export class InsertAttemptDTO {
  user: string;

  challenge: DetailedChallengeDTO;

  code: string;

  language: string;
}
