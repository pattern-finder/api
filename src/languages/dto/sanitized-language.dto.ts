import { Phase } from '../language.schema';

export class SanitizedLanguageDTO {
  _id?: string;

  name: string;

  extension: string;

  phases: Phase[];

  editedAt?: Date;

  createdAt: Date;

  deletedAt?: Date;
}

export const sanitizedLanguageTemplate: SanitizedLanguageDTO = {
  _id: '',

  name: '',

  extension: '',

  phases: [],

  editedAt: new Date(),
  createdAt: new Date(),
  deletedAt: new Date(),
};
