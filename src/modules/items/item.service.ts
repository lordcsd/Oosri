import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/prisma.service';

@Injectable()
export class ItemService {
  constructor(private readonly prismaService: PrismaService) {}

  
}
