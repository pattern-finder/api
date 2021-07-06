import {
  IsAlphanumeric,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateChallengeDTO {
  @IsNotEmpty()
  @IsMongoId()
  id: string;

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
