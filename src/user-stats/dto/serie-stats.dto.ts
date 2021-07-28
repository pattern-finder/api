import { ChallengeStatsDTO } from './challenge-stats.dto';

export class SerieStatsDTO {
  _id: string;
  name: string;
  challenges: ChallengeStatsDTO[];
}
