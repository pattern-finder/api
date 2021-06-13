export class SanitizedSerieDTO {
  _id?: string;

  name: string;

  challenges: any[];

  editedAt?: Date;

  createdAt: Date;

  deletedAt?: Date;
}

export const sanitizedSerieTemplate: SanitizedSerieDTO = {
  _id: '',
  name: '',
  challenges: [],
  editedAt: new Date(),
  createdAt: new Date(),
  deletedAt: new Date(),
};
