import { IResponseDTO } from './response-dto.interface';

export class GetResourceResponseObject<T_resource> implements IResponseDTO {
  readonly statusCode = 200;
  constructor(readonly content: T_resource) {}
}
