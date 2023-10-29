import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { USER_TYPE } from '../../../common/enum/user-types.enum';
import { CHECK_USER_TYPE } from '../../../common/decorators/check-user-group.decorator';
import { Encryptor } from '../../../utils/encryptor';
import { decode, JwtPayload, sign } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { configConstants } from '../../../config/configConstants';
import { PrismaService } from '../../shared/prisma.service';

@Injectable()
export class JWTAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private readonly encryptor: Encryptor,
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const req = context.switchToHttp().getRequest();
    const token = req.headers?.authorization.replace('Bearer ', '');
    const plainToken = this.encryptor.decrypt(token);
    const decoded = decode(plainToken, {}) as JwtPayload;

    const userTypes: USER_TYPE[] = this.reflector.getAllAndOverride(
      CHECK_USER_TYPE,
      [context.getHandler(), context.getClass()],
    );

    const secondsBeforeExpire = +new Date(decoded.exp * 1000) - +new Date();

    const validateUserType = async () => {
      if (userTypes) {
        const user = await this.prismaService.user.findFirst({
          where: { id: decoded.id },
        });

        const userValid =
          (userTypes.includes(USER_TYPE.BUYER) && user.buyerProfileId) ||
          (userTypes.includes(USER_TYPE.SELLER) && user.sellerProfileId);

        if (!userValid) {
          throw new ForbiddenException('Not Allowed');
        }

        const role = user.buyerProfileId ? USER_TYPE.BUYER : USER_TYPE.SELLER;
        const payload = { id: decoded.id, role, userTypes };
        const resigned = sign(
          payload,
          this.configService.get<string>(configConstants.jwt.secret),
          { expiresIn: secondsBeforeExpire },
        );

        req.headers.authorization = `Bearer ${resigned}`;
      }
      return super.canActivate(context);
    };

    return validateUserType() as Promise<boolean>;
  }
}
