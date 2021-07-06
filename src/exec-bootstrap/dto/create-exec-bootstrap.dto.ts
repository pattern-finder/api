import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { Challenge } from 'src/challenges/challenge.schema';
import { Exists } from 'src/common/validator/exists.validator';

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
