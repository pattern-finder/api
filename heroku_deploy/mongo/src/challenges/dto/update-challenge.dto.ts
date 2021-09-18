import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateChallengeDTO {
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  name?: string;

  @IsNotEmpty()
  @IsOptional()
  @IsString()
  instructions?: string;
}
