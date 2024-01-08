// src/main.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TelegramBotService } from './telegram-bot.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const telegramBotService = app.get(TelegramBotService);
  telegramBotService.start();
  await app.listen(3000);
}
bootstrap();
