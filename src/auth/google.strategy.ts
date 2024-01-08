import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: '1057889024584-mk646151n87f2ifneketjra5sshqekjm.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: 'http://localhost:3000/auth/google/callback',
      passReqToCallback: true,
      scope: ['profile', 'email'],
    });
  }

  async validate(request: any, accessToken: string, refreshToken: string, profile: any, done: any): Promise<any> {
    // Validate user, save user information to the database, etc.
    const user = {
      userId: profile.id,
      email: profile.emails[0].value,
    };
    return done(null, user);
  }
}
