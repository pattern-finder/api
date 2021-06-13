import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { isMongoId } from 'class-validator';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import HTTPMethod from './http-methods.enum';

@Injectable()
export class LinkifyInterceptor<T_response> implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<T_response | string> {
    const request = context.switchToHttp().getRequest();

    return next.handle().pipe(
      map((flow) => {
        switch (request.method as HTTPMethod) {
          case HTTPMethod.GET:
            return this.linkifyResource(
              flow,
              this.stripOriginalUrl(request.originalUrl),
            );
          case HTTPMethod.POST || HTTPMethod.PUT:
            return this.generateUrl(
              this.stripOriginalUrl(request.originalUrl),
              flow._id || undefined,
            );
          default:
            return flow;
        }
      }),
    );
  }

  private stripOriginalUrl(originalUrl: string): string {
    return originalUrl.split('/')[1];
  }

  private generateUrl(route: string, id: string): string {
    return `${
      process.env.API_EXTERNAL_HOST
        ? process.env.API_EXTERNAL_HOST
        : `http://localhost`
    }${
      process.env.API_EXTERNAL_PORT
        ? `:${process.env.API_EXTERNAL_PORT}`
        : ':3000'
    }/${route}${id ? `/${id}` : ''}`;
  }

  private linkifyResource(obj: any, route: string): any {
    if (Array.isArray(obj)) {
      return obj.map((o) => this.linkifyResource(o, route));
    }

    const res = {};
    for (const k in obj) {
      if (k === 'id') return;

      if (obj[k] instanceof Date) {
        res[k] = obj[k];
      } else if (obj[k] && isMongoId(obj[k].toString())) {
        res[k] = this.generateUrl(route, obj[k]);
      } else if (obj[k] != undefined && typeof obj[k] === 'object') {
        res[k] = this.linkifyResource(obj[k], route);
      } else {
        res[k] = obj[k];
      }
    }
    return res;
  }
}
