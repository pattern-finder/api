import {
  isMongoId,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint()
export class IsIdArray implements ValidatorConstraintInterface {
  public async validate(idArray: string[]) {
    return (
      Array.isArray(idArray) &&
      idArray.reduce((prev, next) => prev && isMongoId(next), true)
    );
  }
}
