import { User } from 'src/users/user.schema';

export class FetchedAttemptDTO {
  id?: string;
  user: User;
  execBootstrap: string;
  code: string;
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
