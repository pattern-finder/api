import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class EvaluatePlagiaDTO {

  @IsNotEmpty()
  codeToken: string;

  @IsNotEmpty()
  user: string;

  @IsNotEmpty()
  exoName: string;
}
