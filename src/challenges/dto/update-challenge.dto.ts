import {
  IsAlphanumeric,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateChallengeDTO {
  @IsNotEmpty()
  @IsString()
  @IsAlphanumeric()
  @IsOptional()
  name?: string;

  @IsNotEmpty()
  @IsOptional()
  @IsString()
  instructions?: string;
}
