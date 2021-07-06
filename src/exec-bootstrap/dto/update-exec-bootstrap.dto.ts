import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateExecBootstrapDTO {
  @IsNotEmpty()
  @IsMongoId()
  id: string;

  @IsNotEmpty()
  @IsOptional()
  @IsString()
  tests: string;
}
