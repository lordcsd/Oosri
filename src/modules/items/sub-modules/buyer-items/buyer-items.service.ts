import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma.service';
import { Prisma } from '@prisma/client';
import { BaseResult } from '../../../../results/base.result';

@Injectable()
export class BuyerItemsService {
  constructor(private readonly prismaService: PrismaService) {}

  async toggleFavorite(buyerProfileId: number, id: number) {
    await this.findItemOrThrow({ where: { id } });

    const alreadyLiked =
      (await this.prismaService.item.count({
        where: { id, likes: { some: { id: buyerProfileId } } },
      })) > 0;

    await this.prismaService.buyerProfile.update({
      where: { id: buyerProfileId },
      data: {
        liked: {
          ...(alreadyLiked ? { disconnect: { id } } : { connect: { id } }),
        },
      },
    });

    const message = alreadyLiked
      ? 'Item removed from favorites'
      : 'Item added to favourites';

    return new BaseResult(200, message);
  }

  private async findItemOrThrow(options: Prisma.ItemFindFirstArgs) {
    const item = await this.prismaService.item.findFirst(options);

    if (!item) throw new NotFoundException('Invalid Item id');

    return item;
  }
}
