// google.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, Profile } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { configConstants } from '../../../config/configConstants';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get(configConstants.google.auth.clientId),
      clientSecret: configService.get(configConstants.google.auth.clientSecret),
      callbackURL: configService.get(configConstants.google.auth.callbackUrl),
      passReqToCallback: true,
      scope: ['profile', 'email'],
    });
  }

  async validate(
    request: any,
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, displayName, emails, photos } = profile;

    const user = {
      googleId: id,
      displayName,
      email: emails[0]?.value,
      photo: photos[0]?.value,
      accessToken,
    };

    done(null, user);
  }
}
