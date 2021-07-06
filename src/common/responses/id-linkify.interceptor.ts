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
            return this.postReturnIfId(flow, request);
          default:
            return flow;
        }
      }),
    );
  }

  private postReturnIfId(flow: any, request: any) {
    if (flow._id !== undefined) {
      return {
        _id: flow._id,
        url: this.generateUrl(
          this.stripOriginalUrl(request.originalUrl),
          flow._id || undefined,
        ),
      };
    }

    return flow;
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
