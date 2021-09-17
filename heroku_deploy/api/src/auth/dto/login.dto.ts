import { IsAlphanumeric, IsNotEmpty, IsString } from 'class-validator';

export class LoginDTO {
  @IsString()
  @IsAlphanumeric()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
