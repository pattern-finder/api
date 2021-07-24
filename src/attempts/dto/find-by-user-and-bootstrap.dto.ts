import { IsMongoId, IsNotEmpty } from "class-validator";

export class FindByUserAndBootstrapDTO {
  @IsMongoId()
  @IsNotEmpty()
  user: string;

  @IsMongoId()
  @IsNotEmpty()
  execBootstrap: string;
}
