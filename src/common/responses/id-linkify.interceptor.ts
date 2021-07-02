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

// @Injectable()
// export class LinkifyInterceptor<T_response> implements NestInterceptor {
//   intercept(
//     context: ExecutionContext,
//     next: CallHandler,
//   ): Observable<T_response | string> {

//     const request = context.switchToHttp().getRequest();

//     return next.handle().pipe(
//       map((flow) => {
//         switch (request.method as HTTPMethod) {
//           case HTTPMethod.GET:
//             return this.linkifyResource(
//               flow,
//               this.stripOriginalUrl(request.originalUrl),
//             );
//           case HTTPMethod.POST || HTTPMethod.PUT:
//             return this.generateUrl(
//               this.stripOriginalUrl(request.originalUrl),
//               flow._id || undefined,
//             );
//           default:
//             return flow;
//         }
//       }),
//     );
//   }

//   private stripOriginalUrl(originalUrl: string): string {
//     return originalUrl.split('/')[1];
//   }

//   private generateUrl(route: string, id: string): string {
//     return `${
//       process.env.API_EXTERNAL_HOST
//         ? process.env.API_EXTERNAL_HOST
//         : `http://localhost`
//     }${
//       process.env.API_EXTERNAL_PORT
//         ? `:${process.env.API_EXTERNAL_PORT}`
//         : ':3000'
//     }/${route}${id ? `/${id}` : ''}`;
//   }

//   private linkifyResource(obj: any, route: string): any {
//     if (Array.isArray(obj)) {
//       return obj.map((o) => this.linkifyResource(o, route));
//     }

//     if (obj instanceof Date) {
//       return obj;
//     }

//     if (obj && isMongoId(obj.toString())) {
//       return this.generateUrl(route, obj);
//     }

//     if (obj != undefined && typeof obj === 'object') {
//       const res = {};
//       for (const k in obj) {
//         res[k] = this.linkifyResource(obj[k], route);
//       }

//       return res;
//     }

//     return obj;
//   }
// }
