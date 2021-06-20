import { Language } from '../attempt.schema';

export class SanitizedAttemptDTO {
  _id?: string;

  user: string;

  challenge: string;

  code: string;

  language: Language;

  stdout: string;

  memory: number;

  time: number;

  token: string;

  editedAt?: Date;

  createdAt: Date;

  deletedAt?: Date;
}

export const sanitizedAttemptTemplate: SanitizedAttemptDTO = {
  _id: '',

  user: '',

  challenge: '',

  code: '',

  language: Language.BASH,

  stdout: '',

  memory: 0,

  time: 0,

  token: '',

  editedAt: new Date(),
  createdAt: new Date(),
  deletedAt: new Date(),
};