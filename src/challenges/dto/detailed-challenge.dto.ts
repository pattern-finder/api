import { ListExecBootstrapDTO } from 'src/exec-bootstrap/dto/list-exec-bootstrap.dto';
import { PictureUrlDTO } from 'src/pictures/dto/picture-url.dto';

// TODO add some exec infos and language

export class DetailedChallengeDTO {
  _id?: string;

  name: string;

  instructions: string;

  owner: string;

  pictures?: PictureUrlDTO[];

  execBootstraps: ListExecBootstrapDTO[];

  editedAt?: Date;

  createdAt: Date;

  deletedAt?: Date;
}

export const detailedChallengeTemplate: DetailedChallengeDTO = {
  _id: '',

  name: '',

  instructions: '',

  owner: '',

  execBootstraps: [],

  editedAt: new Date(),
  createdAt: new Date(),
  deletedAt: new Date(),
};
