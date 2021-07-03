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
          (res, resource) => generateUrl(resource, res[attr.attribute]),
        );
      });

      return res;
    }
  }

  return mixin(ParameterizedLinkifierInterceptor) as unknown as ClassDecorator;
}
