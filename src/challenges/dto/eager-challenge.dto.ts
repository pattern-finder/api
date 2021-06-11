import { PictureUrlDTO } from 'src/pictures/dto/picture-url.dto';
import { User } from 'src/users/user.schema';

export class EagerChallengeDTO {
  name: string;

  instructions: string;

  owner: User;

  pictures?: PictureUrlDTO[];

  editedAt?: Date;

  createdAt: Date;

  deletedAt?: Date;
}
