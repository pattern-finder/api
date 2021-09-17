export class SanitizedUserDTO {
  _id?: string;

  username: string;

  avatarUrl?: string;

  email: string;

  editedAt?: Date;

  createdAt: Date;

  deletedAt?: Date;
}

export const sanitizedUserTemplate: SanitizedUserDTO = {
  _id: '',
  username: '',
  avatarUrl: '',
  email: '',
  editedAt: new Date(),
  createdAt: new Date(),
  deletedAt: new Date(),
};
