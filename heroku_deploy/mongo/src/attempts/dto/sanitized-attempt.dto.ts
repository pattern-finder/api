export class SanitizedAttemptDTO {
  _id?: string;

  user: string;

  code: string;

  status: number;

  phase: string;

  stdout: string;

  memory: number;

  time: number;

  time_wall: number;

  used_memory: number;

  csw_voluntary: number;

  csw_forced: number;

  token: string;

  editedAt?: Date;

  createdAt: Date;

  deletedAt?: Date;
}

export const sanitizedAttemptTemplate: SanitizedAttemptDTO = {
  _id: '',

  user: '',

  code: '',

  stdout: '',

  memory: 0,

  time: 0,

  token: '',

  csw_forced: 0,

  csw_voluntary: 0,

  phase: '',

  status: 0,

  time_wall: 0,

  used_memory: 0,

  editedAt: new Date(),
  createdAt: new Date(),
  deletedAt: new Date(),
};
