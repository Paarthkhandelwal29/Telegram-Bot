// auth.controller.ts
import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { GoogleAuthGuard } from './google-auth.guard'; // Import your GoogleAuthGuard

@Controller('/auth')
export class AuthController {
  @Get('/google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(@Req() req, @Res() res) {
    // Handle the Google OAuth callback logic here
    return res.redirect('/'); // Redirect to the desired page after successful authentication
  }
}
