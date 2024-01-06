import {
  ConflictException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { configConstants } from '../../config/configConstants';
import {
  JWT_Tokens,
  LoginDTO,
  RegisterDTO,
  CompeteSignInOrRegisterWithGoogleDTO,
} from './dto/register.dto';
import { PrismaService } from '../shared/prisma.service';
import { compareSync, hash } from 'bcrypt';
import { RegisterResult } from './results/register.result';
import { BuyerLoginResult, SellerLoginResult } from './results/login.result';
import { Encryptor } from '../../utils/encryptor';
import { UserProfileResult } from './results/user-profile.dto';
import { USER_TYPE } from '../../common/enum/user-types.enum';
import { ADMIN_TYPE } from '../../common/enum/admin-types.enum';
import { PROFILE_IMAGE_PROVIDER, Prisma, User } from '@prisma/client';
import { SaveGoogleUserDTO } from './dto/google-auth.dto';
import { Request } from 'express';
import {
  CompleteForgotPasswordDTO,
  EmailVerificationDTO,
  ForgotPasswordDTO,
  ResetPasswordDTO,
} from './dto/verification.dto';
import { BaseResult } from '../../results/base.result';
import { RandomDigits } from './utils/random-digits.util';
@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
    private readonly encryptor: Encryptor,
  ) {}

  get frontendRootUrl() {
    return this.configService.get(configConstants.frontend.rootURL);
  }
  get bcryptSalt() {
    return 10;
  }

  private async findUserOrThrow(options: Prisma.UserFindFirstArgs) {
    const user = await this.prismaService.user.findFirst(options);

    if (!user) {
      throw new NotFoundException('User Not Found');
    }
    return user;
  }

  async saveGoogleUser(
    payload: SaveGoogleUserDTO,
  ): Promise<{ user: User; existed: boolean }> {
    const { email, given_name, family_name, picture, tempToken } = payload;
    const emailInUse = await this.prismaService.user.findFirst({
      where: { email },
      include: { googleAuth: true },
    });

    const tempTokenExp = new Date(Date.now() + 1000 * 60 * 2); // in 2 minutes time

    if (emailInUse) {
      return {
        user: await this.prismaService.user.update({
          where: { id: emailInUse.id },
          data: {
            firstName: given_name,
            lastName: family_name,
            profileImage: picture,
            profileImageProviders: PROFILE_IMAGE_PROVIDER.GOOGLE,
            googleAuth: {
              ...(emailInUse.googleAuth && {
                update: { tempToken, tempTokenExp },
              }),
              ...(!emailInUse.googleAuth && {
                create: { tempToken, tempTokenExp },
              }),
            },
          },
        }),
        existed: true,
      };
    }

    return {
      user: await this.prismaService.user.create({
        data: {
          firstName: given_name,
          lastName: family_name,
          profileImage: picture,
          email,
          emailVerified: true,
          profileImageProviders: PROFILE_IMAGE_PROVIDER.GOOGLE,
          googleAuth: {
            create: { tempToken, tempTokenExp },
          },
        },
      }),
      existed: false,
    };
  }

  async register(payload: RegisterDTO, isSeller: boolean = false) {
    const { email } = payload;
    const existing = await this.prismaService.user.findFirst({
      where: { email },
    });

    if (existing) {
      throw new ConflictException('Email already in use');
    }

    payload.password = await hash(payload.password, this.bcryptSalt);
    const { password, ..._payload } = payload;

    const user = await this.prismaService.user.create({
      data: {
        ..._payload,
        ...(isSeller
          ? {
              sellerProfile: { create: {} },
            }
          : {
              buyerProfile: { create: {} },
            }),
        localAuth: {
          create: {
            password: password,
            refreshToken: '',
          },
        },
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

    await this.sendVerificationMail({ email });
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
        localAuth: true,
        phoneNumber: true,
        country: true,
        countryCode: true,
        buyerProfileId: true,
        sellerProfileId: true,
      },
    });

    if (!user || (user && !compareSync(password, user.localAuth.password))) {
      throw new UnauthorizedException('Access Denied');
    }

    delete user.localAuth;

    const response = this.signInUser(user);
    await this.prismaService.user.update({
      where: { email },
      data: {
        localAuth: {
          update: { refreshToken: response.data.tokens.refreshToken },
        },
      },
    });
    return response;
  }

  private signInUser(user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    country: string;
    countryCode: string;
    buyerProfileId: number;
    sellerProfileId: number;
  }) {
    return user.sellerProfileId
      ? SellerLoginResult.from(
          {
            ...user,
            tokens: this.sign({ id: user.id, role: USER_TYPE.SELLER }),
          },
          'Login Successful',
          201,
        )
      : BuyerLoginResult.from(
          {
            ...user,
            tokens: this.sign({ id: user.id, role: USER_TYPE.BUYER }),
          },
          'Login Successful',
          201,
        );
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

  sign(payload: { id: number; role: USER_TYPE | ADMIN_TYPE }): JWT_Tokens {
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

  private decode(token: string): JWT_Tokens | null {
    token = this.encryptor.decrypt(token);
    return jwt.decode(token, {}) as JWT_Tokens;
  }

  async redirectGoogleUserToCompleteAuthProcess(req: Request) {
    const {
      displayName,
      email,
      photo: picture,
      accessToken: tempToken,
    } = req['user'] as {
      displayName: string;
      email: string;
      photo: string;
      accessToken: string;
    };

    const [given_name = '', family_name = ''] = displayName.split(' ');
    const { existed } = await this.saveGoogleUser({
      email,
      given_name,
      family_name,
      picture,
      tempToken,
    });

    const redirectTo = `${this.frontendRootUrl}/register?tempToken=${tempToken}&firstName=${given_name}&lastName=${family_name}&profileImage=${picture}&email=${email}&userExist=${existed}`;
    return req.res.redirect(redirectTo);
  }

  async completeGoogleAuth(
    payload: CompeteSignInOrRegisterWithGoogleDTO,
  ): Promise<SellerLoginResult | BuyerLoginResult> {
    const { token, userType, ...otherFields } = payload; //phoneNumber, countryCode, country

    const user = await this.prismaService.user.findFirst({
      where: { googleAuth: { tempToken: token } },
      include: { googleAuth: true },
    });

    if (
      !user?.googleAuth?.tempTokenExp ||
      +user.googleAuth.tempTokenExp < Date.now()
    ) {
      throw new UnauthorizedException(
        'Sorry auth token already expired, try again',
      );
    }

    const updatedUser = await this.prismaService.user.update({
      where: { id: user.id },
      data: {
        ...otherFields,
        ...(userType == USER_TYPE.BUYER && { buyerProfile: { create: {} } }),
        ...(userType == USER_TYPE.SELLER && { sellerProfile: { create: {} } }),
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        localAuth: true,
        phoneNumber: true,
        country: true,
        countryCode: true,
        buyerProfileId: true,
        sellerProfileId: true,
      },
    });

    if (!user?.googleAuth || user?.googleAuth?.tempToken != token) {
      throw new UnauthorizedException('Invalid Token');
    }

    return this.signInUser(updatedUser);
  }

  private decryptEmailVerificationTokenOrThrow(code: string) {
    try {
      const { code: _code, exp } = JSON.parse(this.encryptor.decrypt(code)) as {
        code: string;
        exp: number;
      };

      return { code: _code, exp };
    } catch (err) {
      throw new NotAcceptableException('Invalid Token');
    }
  }

  private confirmOrGenerateNewToken(code?: string): {
    token: string;
    code: string;
  } {
    if (code) {
      const { code: _code, exp } =
        this.decryptEmailVerificationTokenOrThrow(code);

      if (Date.now() < exp) {
        return { token: code, code: _code };
      }
    }

    code = RandomDigits(4);
    const codeExpires = Date.now() + 3600000;
    const token = this.encryptor.encrypt(
      `{"code":"${code}", "exp": ${codeExpires}}`,
    );

    return { token, code };
  }

  async sendVerificationMail(queries: ForgotPasswordDTO): Promise<BaseResult> {
    const user = await this.prismaService.user.findFirst({
      where: queries,
      select: { id: true, emailVerificationToken: true, emailVerified: true },
    });

    if (!user) {
      throw new NotFoundException('Invalid Email');
    }

    if (user.emailVerified) {
      return new BaseResult(200, 'This email is already verified');
    }

    const { token: emailVerificationToken, code } =
      this.confirmOrGenerateNewToken(user.emailVerificationToken);

    await this.prismaService.user.update({
      where: queries,
      data: { emailVerificationToken },
    });

    // TODO:
    // send email to user
    return new BaseResult(200, 'Verification Mail Sent');
  }

  async completeEmailVerification({
    email,
    code,
  }: EmailVerificationDTO): Promise<BaseResult> {
    const user = await this.findUserOrThrow({
      where: { email },
      select: { id: true, emailVerificationToken: true, emailVerified: true },
    });

    if (user.emailVerified) {
      return new BaseResult(200, 'This email is already verified');
    }

    if (!user.emailVerificationToken) {
      throw new UnprocessableEntityException(
        'Something went wrong, Please repeat verification process',
      );
    }

    const decryped = this.decryptEmailVerificationTokenOrThrow(
      user.emailVerificationToken,
    );

    const validCode = decryped.code == code;

    if (!validCode || Date.now() > decryped.exp) {
      throw new NotAcceptableException(
        'Expired or Invalid email verification code',
      );
    }

    await this.prismaService.user.update({
      where: { email },
      data: { emailVerified: true, emailVerificationToken: null },
    });

    return new BaseResult(200, 'Email Verified');
  }

  async forgotPassword({ email }: ForgotPasswordDTO): Promise<BaseResult> {
    const user = await this.findUserOrThrow({
      where: { email },
      select: { id: true, forgotPasswordToken: true },
    });

    const { token, code } = this.confirmOrGenerateNewToken(
      user.forgotPasswordToken,
    );
    // send forgot password mail

    await this.prismaService.user.update({
      where: { email },
      data: { forgotPasswordToken: token },
    });

    return new BaseResult(200, `Password recovery mail sent to ${email}`);
  }

  async completeForgotPassword({
    token,
    email,
    newPassword,
  }: CompleteForgotPasswordDTO): Promise<BaseResult> {
    const user = await this.findUserOrThrow({
      where: { email },
      select: { id: true, forgotPasswordToken: true, localAuthId: true },
    });

    const { code, exp } = this.decryptEmailVerificationTokenOrThrow(
      user.forgotPasswordToken,
    );

    if (code != token || exp < Date.now()) {
      throw new NotAcceptableException('Invalid or Expired Token');
    }

    const password = await hash(newPassword, this.bcryptSalt);
    await this.prismaService.user.update({
      where: { email },
      data: {
        forgotPasswordToken: null,
        localAuth: {
          ...(user.localAuthId && { update: { password } }),
          ...(!user.localAuthId && { create: { password } }), // for users who registered with google
        },
      },
    });

    return new BaseResult(200, 'Password Reset Successful');
  }

  async resetPassword(
    id: number,
    payload: ResetPasswordDTO,
  ): Promise<BaseResult> {
    const { oldPassword, newPassword } = payload;

    const user = (await this.findUserOrThrow({
      where: { id },
      select: { id: true, localAuth: { select: { id: true, password: true } } },
    })) as User & { localAuth: { password: string } };

    const validOldPassword = compareSync(
      oldPassword,
      user?.localAuth?.password,
    );

    if (!user?.localAuth?.password || !validOldPassword) {
      throw new NotAcceptableException('Invalid Old Password');
    }

    const password = await hash(newPassword, this.bcryptSalt);
    await this.prismaService.user.update({
      where: { id },
      data: { localAuth: { update: { password } } },
    });

    return new BaseResult(200, 'Password Reset Successfully');
  }

  async refreshToken(
    refreshToken: string,
  ): Promise<SellerLoginResult | BuyerLoginResult> {
    const user = await this.prismaService.user.findFirst({
      where: { localAuth: { refreshToken } },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phoneNumber: true,
        country: true,
        countryCode: true,
        buyerProfileId: true,
        sellerProfileId: true,
        localAuth: { select: { refreshToken: true } },
      },
    });

    if (!user) {
      throw new NotAcceptableException('Invalid Token');
    }

    const decrypted = this.encryptor.decrypt(user.localAuth.refreshToken);
    const decoded = jwt.decode(decrypted) as { id: number };

    if (!decoded || decoded.id != user.id) {
      throw new NotAcceptableException('Invalid Token');
    }
    const { localAuth, ...otherUserFields } = user;
    const response = this.signInUser(otherUserFields);
    response.data.tokens.refreshToken = localAuth.refreshToken;

    return response;
  }
}
