import { IResponseDTO } from './response-dto.interface';

export class CreatedOrModifiedResponseObject implements IResponseDTO {
  readonly url;

  constructor(
    route: string,
    id: string,
    readonly statusCode: 200 | 201,
    readonly message: 'Object created.' | 'Object modified.',
  ) {
    {
      this.url = `http${process.env.USE_SSL ? 's' : ''}://${
        process.env.API_EXTERNAL_HOST || 'http://localhost'
      }:${process.env.API_EXTERNAL_PORT || '3000'}${route}${
        id ? `/${id}` : ''
      }`;
    }
  }
}
