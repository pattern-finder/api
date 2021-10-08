import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSerieDTO {
  @IsNotEmpty()
  @IsString()
  name: string;
}
