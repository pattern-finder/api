import { NestFactory } from '@nestjs/core';
import { CommandModule, CommandService } from 'nestjs-command';
import { SeedsModule } from './seed/seeds.module';

(async () => {
  const app = await NestFactory.createApplicationContext(SeedsModule, {
    logger: true,
  });
  app.select(CommandModule).get(CommandService).exec();
})();
