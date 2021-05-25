import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { WrappedResponseDTO } from './dto/wrapped-response.dto';
import HTTPMethod from './http-methods.enum';

@Injectable()
export class WrapperInterceptor<T_response> implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<WrappedResponseDTO<T_response>> {
    const request = context.switchToHttp().getRequest();

    const status = request.res.statusCode;

    return next.handle().pipe(
      map((flow) => {
        switch (request.method as HTTPMethod) {
          case HTTPMethod.GET:
            return {
              content: flow,
              message: 'OK',
              statusCode: status,
            } as WrappedResponseDTO<T_response>;
          case HTTPMethod.POST:
            return {
              content: flow,
              message: 'Created',
              statusCode: status,
            } as WrappedResponseDTO<T_response>;
          case HTTPMethod.PUT:
            return {
              content: flow,
              message: 'Modified',
              statusCode: status,
            } as WrappedResponseDTO<T_response>;
          default:
            return flow;
        }
      }),
    );
  }
}
