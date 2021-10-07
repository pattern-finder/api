export class DetailedExecBootstrapDTO {
  _id?: string;

  challenge: string;

  language: string;

  tests: string;

  functionTemplate: string;

  editedAt?: Date;

  createdAt: Date;

  deletedAt?: Date;
}

export const detailedExecBootstrapTemplate: DetailedExecBootstrapDTO = {
  _id: '',

  challenge: '',

  language: '',

  functionTemplate: '',

  tests: '',

  editedAt: new Date(),
  createdAt: new Date(),
  deletedAt: new Date(),
};
