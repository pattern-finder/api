import { IResponseDTO } from './response-dto.interface';

export class CreatedOrModifiedResponse implements IResponseDTO {
  readonly url;

  constructor(
    id: string,
    route: string,
    readonly statusCode: 200 | 201,
    readonly message: 'Object created' | 'Object modified',
  ) {
    {
      this.url = `${process.env.API_EXTERNAL_HOST || 'http://localhost'}:${
        process.env.API_EXTERNAL_PORT || '3000'
      }/${route}/${id}`;
    }
  }
}
