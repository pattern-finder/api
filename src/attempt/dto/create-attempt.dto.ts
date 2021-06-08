import { IsEnum, IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { Language } from '../attempt.schema';

export class CreateAttemptDTO {
  @IsNotEmpty()
  @IsMongoId()
  challenge: string;

  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsEnum(Language, {
    message: `
      Language must be one of :${Object.values(Language).toString()}
      `,
  })
  language: Language;
}
