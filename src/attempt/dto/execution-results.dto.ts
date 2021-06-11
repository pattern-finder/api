export class ExecutionResultsDTO {
  id: string;
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
