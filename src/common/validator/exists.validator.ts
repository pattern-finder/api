/* eslint-disable @typescript-eslint/ban-types */
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { getConnectionToken } from '@nestjs/mongoose';
import { connection } from 'mongoose';
import { Injectable } from '@nestjs/common';

// Define validator class
@ValidatorConstraint({ async: true })
@Injectable()
export class ExistsInDatabaseConstraint
  implements ValidatorConstraintInterface
{
  async validate(value: any, args: ValidationArguments) {
    // const entityName = value.name;
    const entity = args.object[`class_entity_${args.property}`];
    console.log(args);

    console.log(getConnectionToken());

    console.log(connection.db);

    console.log(connection.collections);

    return await connection.collections[entity]
      .countDocuments({ [args.property]: value })
      .then((nbdocs) => nbdocs > 1);
  }
}

// Define decorator wrapper for above validator
export function Exists(
  entity: Function,
  validationOptions?: ValidationOptions,
) {
  validationOptions = {
    ...{ message: '$property $value not found' },
    ...validationOptions,
  };

  return function (object: Record<string, any>, propertyName: string) {
    object[`class_entity_${propertyName}`] = entity;
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: ExistsInDatabaseConstraint,
    });
  };
}
