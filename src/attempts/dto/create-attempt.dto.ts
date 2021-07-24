import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';
export class CreateAttemptDTO {
  @IsNotEmpty()
  @IsMongoId()
  execBootstrap: string;

  @IsNotEmpty()
  @IsString()
  code: string;
}
