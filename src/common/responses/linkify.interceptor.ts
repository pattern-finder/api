import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { isMongoId } from 'class-validator';
import { Observable } from 'rxjs';

@Injectable()
export abstract class LinkifyInterceptor implements NestInterceptor {
  abstract intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any>;

  protected linkifyResource(obj: any, route: string): any {
    if (Array.isArray(obj)) {
      return obj.map((o) => this.linkifyResource(o, route));
    }

    if (obj instanceof Date) {
      return obj;
    }

    if (obj && isMongoId(obj.toString())) {
      return this.generateUrl(route, obj);
    }

    if (obj != undefined && typeof obj === 'object') {
      const res = {};
      for (const k in obj) {
        res[k] = this.linkifyResource(obj[k], route);
      }

      return res;
    }

    return obj;
  }

  protected stripOriginalUrl(originalUrl: string): string {
    return originalUrl.split('/')[1];
  }

  protected generateUrl(route: string, id: string): string {
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

  protected applyLinkifyFunction(
    object: any,
    originalUrl: string,
    callback: (object: any, originalUrl?: string) => any,
  ) {
    if (Array.isArray(object)) {
      return object.map((o) => callback(o, originalUrl));
    }

    return callback(object, originalUrl);
  }
}
