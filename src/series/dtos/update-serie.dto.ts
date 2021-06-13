import {
  IsAlphanumeric,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateSerieDTO {
  @IsNotEmpty()
  @IsString()
  @IsAlphanumeric()
  @IsOptional()
  name: string;
}
