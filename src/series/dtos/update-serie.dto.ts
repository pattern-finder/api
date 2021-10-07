import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class ChallengeIdObject {
  @IsMongoId()
  @IsNotEmpty()
  _id: string;
}
export class UpdateSerieDTO {
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  name?: string;

  @IsNotEmpty()
  @IsMongoId()
  _id: string;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ChallengeIdObject)
  challenges?: ChallengeIdObject[];
}
