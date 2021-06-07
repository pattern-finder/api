import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdatePictureDTO {
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  filename?: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  alt?: string;
}
