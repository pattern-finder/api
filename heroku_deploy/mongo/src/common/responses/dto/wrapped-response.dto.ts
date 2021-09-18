export class WrappedResponseDTO<T_return> {
  statusCode: number;

  message: string;

  content: T_return | string;
}
