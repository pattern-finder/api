import {
  IsAlphanumeric,
  IsNotEmpty,
  IsString,
  Matches,
  IsEmail,
} from 'class-validator';

export class CreateUserDTO {
  @IsNotEmpty()
  @IsString()
  @IsAlphanumeric()
  username: string;

  @IsNotEmpty()
  @IsString()
  @Matches(
    /^(?=.{8,})(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[#?!@$ %^&*-])([a-zA-Z#?!@$ %^&*-]*\d){3,}/,
    {
      message:
        'Password must contain at least 8 character with lower and uppercase characters, special characters, and at least 3 digits.',
    },
  )
  password: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
}
