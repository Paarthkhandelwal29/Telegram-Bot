// src/weather/weather.service.ts
import axios from 'axios';
import { Injectable } from '@nestjs/common';
import fetch from 'node-fetch';

@Injectable()
export class WeatherService {
  private apiKey: string = '48ed4d2121dffed8270797cf95590885';

  async getWeather(location: string): Promise<string> {
    const apiUrl = `http://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${this.apiKey}`;
    const data = await axios.get(apiUrl);
    console.log(data);
    // const response = await fetch(apiUrl);
    // const data = await response.json();

    return `Weather in ${location}: ${data.data.weather[0].description}, Temperature: ${data.data.main.temp}°C`;
  }
}
