import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';
export class CreateAttemptDTO {
  @IsNotEmpty()
  @IsMongoId()
  challenge: string;

  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsString()
  language: string;
}
