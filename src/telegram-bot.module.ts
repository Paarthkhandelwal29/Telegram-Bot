// src/telegram-bot/telegram-bot.module.ts

import { Module } from '@nestjs/common';
import { WeatherModule } from './weather.module';
import { TelegramBotService } from './telegram-bot.service';

@Module({
  imports: [WeatherModule],
  providers: [TelegramBotService],
})
export class TelegramBotModule {}
