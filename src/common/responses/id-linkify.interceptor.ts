import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import HTTPMethod from './http-methods.enum';
import { LinkifyInterceptor } from './linkify.interceptor';

@Injectable()
export class IdLinkifierInterceptor
  extends LinkifyInterceptor
  implements NestInterceptor
{
  intercept(context: ExecutionContext, next: CallHandler): any {
    const request = context.switchToHttp().getRequest();

    return next.handle().pipe(
      map((flow) => {
        switch (request.method as HTTPMethod) {
          case HTTPMethod.GET:
            return this.applyLinkifyFunction(
              flow,
              request.originalUrl,
              (o, url) => this.linkifyId(o, url),
            );
          case HTTPMethod.POST || HTTPMethod.PUT:
            return {
              _id: flow._id,
              url: this.generateUrl(
                this.stripOriginalUrl(request.originalUrl),
                flow._id || undefined,
              ),
            };
          default:
            return flow;
        }
      }),
    );
  }

  private linkifyId(object: any, originalUrl: string) {
    return {
      ...object,
      url: this.generateUrl(
        this.stripOriginalUrl(originalUrl),
        object._id || undefined,
      ),
    };
  }
}
