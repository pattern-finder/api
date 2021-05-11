import { IsAlphanumeric, IsNotEmpty, IsString } from 'class-validator';

export class CreateChallengeDTO {
  @IsNotEmpty()
  @IsString()
  @IsAlphanumeric()
  name: string;

  @IsNotEmpty()
  @IsString()
  instructions: string;

  @IsNotEmpty()
  @IsString()
  imageUrl: string;
}
