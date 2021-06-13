import { IsAlphanumeric, IsNotEmpty, IsString } from 'class-validator';

export class CreateSerieDTO {
  @IsNotEmpty()
  @IsString()
  @IsAlphanumeric()
  name: string;
}
