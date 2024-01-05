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

    // console.log({ accessToken, refreshToken, profile, done });

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


// {
//     accessToken: 'ya29.a0AfB_byCZvGPGvTN3hSpQYm0OOAnk0lpj5GaAFSdsYNd7fCUdxQk1ft0aJo_pjMVMHzeq9J6mD8oO8BDdUR_BVQy77ek2wXx2gNYYw_xJCEoNpHl1wW5cXio7jHJEcIYXkT3f11q2O-cWGbp-lpBu2neISuqp0d3bRCg6aCgYKAbwSARMSFQHGX2MiJz9OlqhlBBTEMHLprOGvgA0171',
//     refreshToken: undefined,
//     profile: {
//       id: '114907239109190853780',
//       displayName: 'chinonso dimgba',
//       name: { familyName: 'dimgba', givenName: 'chinonso' },
//       emails: [ [Object] ],
//       photos: [ [Object] ],
//       provider: 'google',
//       _raw: '{\n' +
//         '  "sub": "114907239109190853780",\n' +
//         '  "name": "chinonso dimgba",\n' +
//         '  "given_name": "chinonso",\n' +
//         '  "family_name": "dimgba",\n' +
//         '  "picture": "https://lh3.googleusercontent.com/a/ACg8ocLpU-Tr9pQSWGPB5Tu8AQCraciIwNqqt-gghkvWKZcU9WQ\\u003ds96-c",\n' +
//         '  "email": "dimgbachinonso@gmail.com",\n' +
//         '  "email_verified": true,\n' +
//         '  "locale": "en"\n' +
//         '}',
//       _json: {
//         sub: '114907239109190853780',
//         name: 'chinonso dimgba',
//         given_name: 'chinonso',
//         family_name: 'dimgba',
//         picture: 'https://lh3.googleusercontent.com/a/ACg8ocLpU-Tr9pQSWGPB5Tu8AQCraciIwNqqt-gghkvWKZcU9WQ=s96-c',
//         email: 'dimgbachinonso@gmail.com',
//         email_verified: true,
//         locale: 'en'
//       }
//     }
// }