import { Challenge } from 'src/challenges/challenge.schema';

export class SanitizedSerieDTO {
  _id?: string;

  name: string;

  challenges: Challenge[];

  owner: string;

  isCourse: boolean;

  editedAt?: Date;

  createdAt: Date;

  deletedAt?: Date;
}

export const sanitizedSerieTemplate: SanitizedSerieDTO = {
  _id: '',
  name: '',
  challenges: [],
  owner: '',
  isCourse: false,
  editedAt: new Date(),
  createdAt: new Date(),
  deletedAt: new Date(),
};
