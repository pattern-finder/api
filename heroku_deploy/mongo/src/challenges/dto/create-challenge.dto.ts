import { IsNotEmpty, IsString } from 'class-validator';

export class CreateChallengeDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  instructions: string;
}
