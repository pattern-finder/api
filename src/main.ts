import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { IdLinkifierInterceptor } from './common/responses/id-linkify.interceptor';
import { WrapperInterceptor } from './common/responses/wrapper.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(
    new WrapperInterceptor(),
    new IdLinkifierInterceptor(),
  );

  await app.listen(process.env.API_INTERNAL_PORT || 3000);
}
bootstrap();
