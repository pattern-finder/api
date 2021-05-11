import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateChallengeDTO {
  @IsNotEmpty()
  @IsMongoId()
  owner: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  instructions: string;

  @IsNotEmpty()
  @IsString()
  imageUrl: string;
}
