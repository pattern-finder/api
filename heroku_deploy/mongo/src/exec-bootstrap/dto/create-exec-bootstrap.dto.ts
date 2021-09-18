import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateExecBootstrapDTO {
  @IsNotEmpty()
  @IsMongoId()
  challenge: string;

  @IsNotEmpty()
  @IsString()
  language: string;

  @IsNotEmpty()
  @IsString()
  tests: string;

  @IsNotEmpty()
  @IsString()
  functionTemplate: string;
}
