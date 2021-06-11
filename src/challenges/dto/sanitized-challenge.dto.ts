export class SanitizedChallengeDTO {
  _id?: string;

  name: string;

  instructions: string;

  imageUrl: string;

  owner: string;

  editedAt?: Date;

  createdAt: Date;

  deletedAt?: Date;
}

export const sanitizedChallengeTemplate: SanitizedChallengeDTO = {
  _id: '',

  name: '',

  instructions: '',

  imageUrl: '',

  owner: '',

  editedAt: new Date(),
  createdAt: new Date(),
  deletedAt: new Date(),
};
