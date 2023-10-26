import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/prisma.service';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

}
