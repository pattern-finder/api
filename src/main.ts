import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WrapperInterceptor } from './common/responses/wrapper.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new WrapperInterceptor());
  await app.listen(process.env.API_INTERNAL_PORT || 3000);
}
bootstrap();
