export class createdResponse {
  readonly statusCode = 201;

  readonly message = 'Object created';

  readonly url;
  constructor(id: string, route: string) {
    {
      this.url = `${process.env.API_EXTERNAL_HOST || 'http://localhost'}:${
        process.env.API_EXTERNAL_PORT || '3000'
      }/${route}/${id}`;
    }
  }
}
