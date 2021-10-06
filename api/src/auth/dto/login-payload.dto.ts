import {
  IsAlphanumeric,
  IsMongoId,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class LoginPayloadDTO {
  @IsNotEmpty()
  @IsString()
  @IsAlphanumeric()
  username: string;

  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  sub: string;
}
