import {
  IsNotEmpty,
  IsOptional,
  Matches,
} from 'class-validator';

export class UpdateUserDTO {
  @IsOptional()
  @IsNotEmpty()
  @Matches(
    /^(?=.{8,})(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[#?!@$ %^&*-])([a-zA-Z#?!@$ %^&*-]*\d){3,}/,
    {
      message:
        'Password must contain at least 8 character with lower and uppercase characters, special characters, and at least 3 digits.',
    },
  )
  password?: string;
}
