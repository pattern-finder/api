import {
  CallHandler,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  mixin,
  NestInterceptor,
} from '@nestjs/common';
import { isMongoId } from 'class-validator';
import { map } from 'rxjs/operators';
import HTTPMethod from './http-methods.enum';
import { LinkifyInterceptor } from './linkify.interceptor';

interface LinkableAttribute {
  attribute: string;
  resource: string;
}

export function ParameterizedLinkifier(
  linkableAttributes: LinkableAttribute[],
): ClassDecorator {
  @Injectable()
  class ParameterizedLinkifierInterceptor
    extends LinkifyInterceptor
    implements NestInterceptor
  {
    intercept(context: ExecutionContext, next: CallHandler): any {
      const request = context.switchToHttp().getRequest();

      return next.handle().pipe(
        map((flow) => {
          switch (request.method as HTTPMethod) {
            case HTTPMethod.GET:
              return this.applyLinkifyFunction(flow, request.originalUrl, (o) =>
                this.linkifyResources(o),
              );
            default:
              return flow;
          }
        }),
      );
    }

    private linkifyResources(object: any) {
      const res = { ...object };

      const generateUrl = this.generateUrl;

      linkableAttributes.forEach((attr) => {
        if (
          !res[attr.attribute] ||
          !isMongoId(res[attr.attribute]) ||
          attr.attribute == '_id'
        ) {
          throw new InternalServerErrorException(
            `The parametrized linkifier was wrongly used: ${attr.attribute} is not a valid mongo ID to linkify`,
          );
        }

        res[attr.attribute] = this.applyLinkifyFunction(
          res,
          attr.resource,
          (res, resource) => generateUrl(resource, res),
        );
      });

      return res;
    }
  }

  return mixin(ParameterizedLinkifierInterceptor) as unknown as ClassDecorator;
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
