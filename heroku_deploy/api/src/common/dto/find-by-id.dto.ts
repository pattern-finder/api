import { IsMongoId, IsNotEmpty } from 'class-validator';

export class FindByIdDTO {
  @IsNotEmpty()
  @IsMongoId()
  id: string;
}
