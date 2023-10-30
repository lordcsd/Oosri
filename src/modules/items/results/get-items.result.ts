import { ITEM_CONDITION } from '@prisma/client';
import {
  BasePaginatedResult,
  ResultPaginationOptions,
} from '../../../results/basePaginated.result';
import { ApiProperty } from '@nestjs/swagger';

export class ItemResultDTO {
  @ApiProperty()
  id: number;

  @ApiProperty({ isArray: true, type: String })
  media: string[];

  @ApiProperty()
  liked: boolean;

  @ApiProperty()
  name: string;

  @ApiProperty()
  condition: ITEM_CONDITION;

  @ApiProperty()
  unitsSold: number;

  @ApiProperty()
  price: number;

  @ApiProperty()
  sellerId: string;

  @ApiProperty()
  brandId: string;

  @ApiProperty()
  categoryId: string;

  @ApiProperty()
  sellerName: string;

  @ApiProperty()
  sellerCountry: string;

  @ApiProperty()
  sellerRating: number;
}

export class ManyItemsResult extends BasePaginatedResult {
  @ApiProperty({ type: ItemResultDTO, isArray: true })
  data: ItemResultDTO[];

  static from(
    data: ItemResultDTO[],
    options: ResultPaginationOptions,
  ): ManyItemsResult {
    return { ...new ManyItemsResult(data, options) };
  }
}
