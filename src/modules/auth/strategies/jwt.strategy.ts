import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PrismaService } from '../../shared/prisma.service';
import { configConstants } from '../../../config/configConstants';
import { JWTDecodedDTO } from '../../../common/dtos/JWTDecoded.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get(configConstants.jwt.secret),
    });
  }

  async validate(payload: JWTDecodedDTO) {
    return payload;
  }
}
