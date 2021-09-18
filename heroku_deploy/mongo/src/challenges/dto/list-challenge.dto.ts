import { ListExecBootstrapDTO } from 'src/exec-bootstrap/dto/list-exec-bootstrap.dto';

export class ListChallengeDTO {
  _id?: string;

  name: string;

  instructions: string;

  owner?: any;

  execBootstraps: ListExecBootstrapDTO[];

  isCourse: boolean;

  editedAt?: Date;

  createdAt: Date;

  deletedAt?: Date;
}

export const listChallengeTemplate: ListChallengeDTO = {
  _id: '',

  name: '',

  instructions: '',

  owner: '{}',

  isCourse: false,

  execBootstraps: [],

  editedAt: new Date(),
  createdAt: new Date(),
  deletedAt: new Date(),
};
