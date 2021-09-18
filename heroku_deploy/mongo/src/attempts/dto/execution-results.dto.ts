export class ExecutionResultsDTO {
  id: string;
  status: number;
  stdout: string;
  stderr: string;
  time: number;
  time_wall: number;
  used_memory: number;
  csw_voluntary: number;
  csw_forced: number;
}
