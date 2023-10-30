import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { itemColors } from './seed-data/item-colors';
import { faker } from '@faker-js/faker';

@Injectable()
export class SharedService implements OnModuleInit {
  constructor(private readonly prismaService: PrismaService) {

  }

  onModuleInit() {
    this.seedItemColors();
  }

  private async seedItemColors() {
    const existing = await this.prismaService.itemColor.findMany({
      select: { name: true },
    });

    const existingNames = existing.map(({ name }) => name);

    const notExisting = itemColors.filter(
      (color) => !existingNames.includes(color.name),
    );

    if (notExisting.length) {
      await this.prismaService.itemColor.createMany({ data: notExisting });
    }
  }
}
