import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePictureDTO {
  @IsNotEmpty()
  @IsString()
  alt: string;
}
