import { IsAlphanumeric, IsNotEmpty, IsString } from "class-validator";

export class UpdateChallengeDTO {
  @IsNotEmpty()
  @IsString()
  @IsAlphanumeric()
  name?: string;

  @IsNotEmpty()
  @IsString()
  instructions?: string;

  @IsNotEmpty()
  @IsString()
  imageUrl?: string;
}
