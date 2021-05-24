import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CreatedOrModifiedResponseObject } from './dto/created-or-modified-response.object';
import { GetResourceResponseObject } from './dto/get-resource-response.object';
enum HTTPMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'put',
}

@Injectable()
export class WrapperInterceptor<T_response> implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    return next.handle().pipe(
      map((flow) => {
        switch (request.method as HTTPMethod) {
          case HTTPMethod.GET:
            return new GetResourceResponseObject(
              flow as T_response,
            ) as GetResourceResponseObject<T_response>;
          case HTTPMethod.POST:
            return new CreatedOrModifiedResponseObject(
              request.originalUrl,
              flow._id || undefined,
              request.status,
              'Object created.',
            );
          case HTTPMethod.PUT:
            return new CreatedOrModifiedResponseObject(
              request.originalUrl,
              flow._id || undefined,
              request.status,
              'Object modified.',
            );
          default:
            return flow;
        }
      }),
    );
  }
}
