import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma.service';
import { AuthService } from '../../../auth/auth.service';
import { LoginDTO } from '../../../auth/dto/register.dto';
import { compareSync, hash } from 'bcrypt';
import { CreateAdminDTO } from './dto/create-admin.dto';
import { AdminLoginResult } from './result/admin-login.result';
import { ADMIN_TYPE } from '../../../../common/enum/admin-types.enum';
import { CreateAdminResult } from './result/create-admin.result';

@Injectable()
export class AdminAuthService {
  bcryptSalt = 10;
  constructor(
    private readonly prismaService: PrismaService,
    private readonly authService: AuthService,
  ) {}

  async login(payload: LoginDTO) {
    const { password, email } = payload;

    const admin = await this.prismaService.admin.findFirst({
      where: { email },
    });

    if (!admin || (admin && !compareSync(password, admin.password))) {
      throw new UnauthorizedException('Access Denied');
    }

    delete admin.password;

    return AdminLoginResult.from(
      {
        ...admin,
        tokens: this.authService.sign({
          id: admin.id,
          role: ADMIN_TYPE[admin.type],
        }),
      },
      201,
      'Login Successful',
    );
  }

  async create(payload: CreateAdminDTO, createdBy: number) {
    const { email } = payload;
    const existing = await this.prismaService.admin.findFirst({
      where: { email },
    });

    if (existing) {
      throw new ConflictException('Email already in use');
    }

    payload.password = await hash(payload.password, this.bcryptSalt);
    const created = await this.prismaService.admin.create({
      data: {
        ...payload,
        createdBy,
      },
      select: {
        id: true,
        name: true,
        email: true,
        type: true,
        createdAt: true,
      },
    });

    return CreateAdminResult.from(created, 'Admin created', 201);
  }
}
