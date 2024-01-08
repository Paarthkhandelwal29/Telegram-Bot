import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('admin')
export class AdminController {
  @Get()
  @UseGuards(AuthGuard('google'))
  async login(): Promise<void> {
    // This route will initiate the Google login process
  }

  @Get('callback')
  @UseGuards(AuthGuard('google'))
  async callback(): Promise<void> {
    // Handle Google login callback
  }

  // Add other routes for managing bot settings and user accounts
}
