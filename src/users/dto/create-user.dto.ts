import { IsNotEmpty, Matches } from 'class-validator';

export class CreateUserDTO {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @Matches(
    /^(?=.{8,})(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[#?!@$ %^&*-])([a-zA-Z#?!@$ %^&*-]*\d){3,}/,
  )
  password: string;
}
