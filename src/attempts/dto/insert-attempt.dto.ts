import { EagerChallengeDTO } from 'src/challenges/dto/eager-challenge.dto';
import { Language } from '../attempt.schema';

export class InsertAttemptDTO {
  user: string;

  challenge: EagerChallengeDTO;

  code: string;

  language: Language;
}
