import { Challenge } from 'src/challenges/challenge.schema';
import { User } from 'src/users/user.schema';

export class FetchedAttemptDTO {
  id?: string;
  user: User;
  challenge: Challenge;
  code: string;
  language: string;
  stdout?: string;
  times: number;
  memory: number;
  stderr?: string;
  token: string;
  compile_output?: string;
  message?: string;
  status: {
    id: number;
    description: 'Accepted' | 'Refused';
  };
}