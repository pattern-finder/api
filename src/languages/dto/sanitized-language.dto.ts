import { Phase } from '../language.schema';

export class SanitizedLanguageDTO {
  _id?: string;

  name: string;

  mainFileName: string;

  phases: Phase[];

  editedAt?: Date;

  createdAt: Date;

  deletedAt?: Date;
}

export const sanitizedLanguageTemplate: SanitizedLanguageDTO = {
  _id: '',

  name: '',

  mainFileName: '',

  phases: [],

  editedAt: new Date(),
  createdAt: new Date(),
  deletedAt: new Date(),
};
