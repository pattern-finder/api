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
import { Types } from 'mongoose';

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

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => Types.ObjectId)
  @IsOptional()
  challenges?: ChallengeIdObject[];

  @IsNotEmpty()
  @IsMongoId()
  _id: string;
}
