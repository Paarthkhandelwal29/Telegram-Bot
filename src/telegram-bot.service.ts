import { Injectable } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { WeatherService } from './weather.service';
import * as mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config();
const paarth = "mongodb+srv://PaarthKhandelwal29:asvyJ2Qpn655J2p@weathercluster0.cg7rvaq.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(`${paarth}`);

async function checkMongoDBConnection(): Promise<boolean> {
  try {
    // Use isConnected method to check if the connection is established
    return mongoose.connection.readyState === 1; // 1 means connected
  } catch (error) {
    console.error('Error checking MongoDB connection:', error);
    return false;
  }
}
console.log(checkMongoDBConnection());
export interface Subscription {
  chatId: number;
  location: string;
}

// Define the schema using Mongoose Schema class
const subscriptionSchema = new mongoose.Schema<Subscription>({
  chatId: { type: Number, required: true },
  location: { type: String, required: true },
});

// Create a Mongoose model for the Subscription schema
const SubscriptionModel = mongoose.model<Subscription>('Subscription', subscriptionSchema);

@Injectable()
export class TelegramBotService {
  private readonly bot = new Telegraf("6681064110:AAE-9XKbWlruPXHm9U2voSBzAv4BOpXCc4E");

  constructor(private readonly weatherService: WeatherService) {
    this.setupCommands();
    this.setupSubscriptions();
  }

  private setupCommands(): void {
    this.bot.command('location', async (ctx) => {
      const location = ctx.message.text.split(' ')[1];
      if (!location) {
        ctx.reply('Please provide a location.');
        return;
      }

      const weatherInfo = await this.weatherService.getWeather(location);
      ctx.reply(weatherInfo);
    });

    this.bot.command('subscribe', async (ctx) => {
      const location = ctx.message.text.split(' ')[1];
      if (!location) {
        ctx.reply('Please provide a location to subscribe.');
        return;
      }

      const chatId = ctx.chat.id;

      // Check if the user is already subscribed to this location
      const existingSubscription = await SubscriptionModel.findOne({ chatId, location });
      if (existingSubscription) {
        ctx.reply(`You are already subscribed to updates for ${location}.`);
        return;
      }

      // Save the subscription to the database
      const newSubscription = new SubscriptionModel({ chatId, location });
      await newSubscription.save();

      ctx.reply(`You are now subscribed to daily updates for ${location}.`);
    });

    this.bot.command('unsubscribe', async (ctx) => {
      const location = ctx.message.text.split(' ')[1];
      if (!location) {
        ctx.reply('Please provide a location to unsubscribe.');
        return;
      }

      const chatId = ctx.chat.id;

      // Check if the user is subscribed to this location
      const existingSubscription = await SubscriptionModel.findOne({ chatId, location });
      if (!existingSubscription) {
        ctx.reply(`You are not subscribed to updates for ${location}.`);
        return;
      }

      // Remove the subscription from the database
      await SubscriptionModel.deleteOne({ chatId, location });

      ctx.reply(`You are now unsubscribed from updates for ${location}.`);
    });
  }

  private async setupSubscriptions(): Promise<void> {
    // Implement subscription logic here (e.g., send daily updates)
    setInterval(async () => {
      const subscriptions = await SubscriptionModel.find();
      for (const subscription of subscriptions) {
        const weatherInfo = await this.weatherService.getWeather(subscription.location);
        this.bot.telegram.sendMessage(subscription.chatId, `Daily update for ${subscription.location}:\n${weatherInfo}`);
      }
    }, 24 * 60 * 60 * 1000); // Send updates every 24 hours
  }

  start(): void {
    this.bot.launch();
  }
}
