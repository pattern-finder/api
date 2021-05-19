import { IsAlphanumeric, IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class LoginDTO {
  @IsString()
  @IsAlphanumeric()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
