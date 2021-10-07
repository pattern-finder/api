import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateExecBootstrapDTO {
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  tests?: string;

  @IsNotEmpty()
  @IsOptional()
  @IsString()
  functionTemplate?: string;
}
