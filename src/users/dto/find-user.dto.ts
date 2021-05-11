import { IsMongoId, IsNotEmpty } from 'class-validator';

export class FindUserDTO {
  @IsNotEmpty()
  @IsMongoId()
  id: string;
}
