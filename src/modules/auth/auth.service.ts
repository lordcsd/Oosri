import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { configConstants } from '../../config/configConstants';
import { JWT_Tokens, LoginDTO, RegisterDTO } from './dto/register.dto';
import { PrismaService } from '../shared/prisma.service';
import { compareSync, hash } from 'bcrypt';
import { RegisterResult } from './results/register.result';
import { BuyerLoginResult, SellerLoginResult } from './results/login.result';
import { Encryptor } from '../../utils/encryptor';
import { UserProfileResult } from './results/user-profile.dto';
import { USER_TYPE } from '../../common/enum/user-types.enum';

@Injectable()
export class AuthService {
  bcryptSalt = 10;
  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
    private readonly encryptor: Encryptor,
  ) {}

  async register(payload: RegisterDTO, isSeller: boolean = false) {
    const { email } = payload;
    const existing = await this.prismaService.user.findFirst({
      where: { email },
    });

    if (existing) {
      throw new ConflictException('Email already in use');
    }

    payload.password = await hash(payload.password, this.bcryptSalt);

    const user = await this.prismaService.user.create({
      data: {
        ...payload,
        ...(isSeller
          ? {
              sellerProfile: { create: {} },
            }
          : {
              buyerProfile: { create: {} },
            }),
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phoneNumber: true,
        country: true,
        countryCode: true,
      },
    });

    return RegisterResult.from(user, 'User Created', 201);
  }

  async login(payload: LoginDTO, isSeller: boolean = false) {
    const { password, email } = payload;

    const user = await this.prismaService.user.findFirst({
      where: {
        email,
        ...(isSeller
          ? {
              sellerProfileId: { not: null },
            }
          : {
              buyerProfileId: { not: null },
            }),
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        password: true,
        phoneNumber: true,
        country: true,
        countryCode: true,
      },
    });

    if (!user || (user && !compareSync(password, user.password))) {
      throw new UnauthorizedException('Access Denied');
    }

    delete user.password;

    if (isSeller) {
      return SellerLoginResult.from(
        {
          ...user,
          tokens: this.sign({ id: user.id, role: USER_TYPE.SELLER }),
        },
        'Login Successful',
        201,
      );
    } else {
      BuyerLoginResult.from(
        {
          ...user,
          tokens: this.sign({ id: user.id, role: USER_TYPE.BUYER }),
        },
        'Login Successful',
        201,
      );
    }
  }

  async getProfile(id: number) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phoneNumber: true,
        country: true,
        countryCode: true,
        profileImage: true,
        walletBalance: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User Not Found');
    }

    return UserProfileResult.from(user, 201, 'User Profile Fetched');
  }

  sign(payload: { id: number; role: USER_TYPE }): JWT_Tokens {
    const accessToken = this.encryptor.encrypt(
      jwt.sign(payload, this.configService.get(configConstants.jwt.secret), {
        expiresIn: '1h',
      }),
    );

    const refreshToken = this.encryptor.encrypt(
      jwt.sign(payload, this.configService.get(configConstants.jwt.secret), {
        expiresIn: '12d',
      }),
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  decode(token: string): JWT_Tokens | null {
    token = this.encryptor.decrypt(token);
    return jwt.decode(token, {}) as JWT_Tokens;
  }
}
