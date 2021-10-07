export class GodboxPhaseOutputDTO {
  name: string;
  status: number;
  stdout: string;
  stderr: string;
  time: number;
  time_wall: number;
  used_memory: number;
  sandbox_status: string;
  csw_voluntary: number;
  csw_forced: number;
}
