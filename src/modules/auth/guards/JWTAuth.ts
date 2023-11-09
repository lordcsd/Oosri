import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { USER_TYPE } from '../../../common/enum/user-types.enum';
import { CHECK_USER_TYPE } from '../../../common/decorators/check-user-group.decorator';
import { Encryptor } from '../../../utils/encryptor';
import { decode, JwtPayload, sign } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { configConstants } from '../../../config/configConstants';
import { PrismaService } from '../../shared/prisma.service';
import { ADMIN_TYPE } from '../../../common/enum/admin-types.enum';
import { CHECK_ADMIN_TYPE } from '../../../common/decorators/check-admin-group.decorator';
import { isPublic } from '../../../common/decorators/public.decorator';
import { isHybrid } from '../../../common/decorators/hybrid.decorator';

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
    const _public = this.reflector.getAllAndOverride(isPublic, [
      context.getHandler(),
      context.getClass(),
    ]);

    const _hybrid = this.reflector.getAllAndOverride(isHybrid, [
      context.getHandler(),
      context.getClass(),
    ]);

    const req = context.switchToHttp().getRequest();
    if (_public || (_hybrid && !req.headers?.authorization)) return true;

    const token = req.headers?.authorization.replace('Bearer ', '');
    const plainToken = this.encryptor.decrypt(token);
    const decoded = decode(plainToken, {}) as JwtPayload;

    const userTypes: USER_TYPE[] = this.reflector.getAllAndOverride(
      CHECK_USER_TYPE,
      [context.getHandler(), context.getClass()],
    );

    const adminTypes: ADMIN_TYPE[] = this.reflector.getAllAndOverride(
      CHECK_ADMIN_TYPE,
      [context.getHandler(), context.getClass()],
    );

    const secondsBeforeExpire = +new Date(decoded.exp * 1000) - +new Date();

    const validateType = async () => {
      if (userTypes && Array.isArray(userTypes)) {
        const user = await this.prismaService.user.findFirst({
          where: { id: decoded.id },
        });

        if (!user) {
          throw new NotFoundException('User Not found');
        }

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
        return super.canActivate(context);
      } else if (adminTypes && Array.isArray(adminTypes)) {
        const admin = await this.prismaService.admin.findFirst({
          where: { id: decoded.id },
        });

        if (!admin) {
          throw new NotFoundException('User Not found');
        }

        const userInvalid = adminTypes.find((typ) => !ADMIN_TYPE[typ]);

        if (userInvalid) {
          throw new ForbiddenException('Not Allowed');
        }

        const payload = {
          id: decoded.id,
          role: admin.type,
          userTypes: adminTypes,
        };

        const resigned = sign(
          payload,
          this.configService.get<string>(configConstants.jwt.secret),
          { expiresIn: secondsBeforeExpire },
        );

        req.headers.authorization = `Bearer ${resigned}`;
        return super.canActivate(context);
      }

      throw new UnauthorizedException('Access Denied');
    };

    return validateType() as Promise<boolean>;
  }
}
