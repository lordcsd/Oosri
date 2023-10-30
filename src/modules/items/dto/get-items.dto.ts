import { ITEM_CONDITION } from '@prisma/client';
import {
  CustomEnumValidator,
  CustomNumberValidator,
  CustomStringValidator,
} from 'nestjs-custom-class-validators';
import { Matches, Min } from 'class-validator';
import { PaginationParamsDTO } from '../../../common/dtos/paginationParams.dto';

export enum ItemSortBy {
  RATING = '"sellerRating"',
  PRICE = '"price"',
  UNITS_SOLD = '"unitsSold"',
  CREATED_AT = '"createdAt"',
}

export class GetItemsDTO extends PaginationParamsDTO {
  @CustomStringValidator({ optional: true })
  @Matches(/^[a-zA-Z0-9\s\\,.]+$/u, { message: 'Invalid Search String' })
  search?: string;

  @CustomNumberValidator({ optional: true })
  categoryId?: number;

  @CustomNumberValidator({ optional: true })
  brandId?: number;

  @CustomNumberValidator({ optional: true })
  @Min(0)
  minPrice?: number = 0;

  @CustomNumberValidator({ optional: true })
  maxPrice?: number;

  @CustomStringValidator({ optional: true })
  country?: string;

  @CustomEnumValidator({ validEnum: ITEM_CONDITION, optional: true })
  condition?: ITEM_CONDITION;

  @CustomEnumValidator({ validEnum: ItemSortBy, optional: true })
  sortBy?: ItemSortBy = ItemSortBy.CREATED_AT;

  @CustomEnumValidator({ validEnum: ['desc', 'asc'], optional: true })
  sortDirection?: 'desc' | 'asc' = 'desc';
}
