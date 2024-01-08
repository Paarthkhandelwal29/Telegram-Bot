// auth.module.ts
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './google.strategy'; // Import your GoogleStrategy
import { AuthController } from './auth.controller'; // Import your AuthController

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'google' }),
  ],
  controllers: [AuthController],
  providers: [GoogleStrategy],
})
export class AuthModule {}
