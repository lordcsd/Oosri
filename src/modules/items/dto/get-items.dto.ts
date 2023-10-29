import { ITEM_CONDITION } from '@prisma/client';
import {
  CustomEnumValidator,
  CustomNumberValidator,
  CustomStringValidator,
} from 'nestjs-custom-class-validators';
import { Min } from 'class-validator';

export class GetItemsDTO {
  @CustomStringValidator({ optional: true })
  search?: string;

  @CustomStringValidator({ isUUID: true, optional: true })
  categoryId?: string;

  @CustomStringValidator({ isUUID: true, optional: true })
  brandId?: string;

  @CustomNumberValidator({ optional: true })
  @Min(0)
  minPrice?: number = 0;

  @CustomNumberValidator({ optional: true })
  maxPrice?: number = Infinity;

  @CustomStringValidator({ optional: true })
  country?: string;

  @CustomEnumValidator({ validEnum: ITEM_CONDITION, optional: true })
  condition?: ITEM_CONDITION;

  @CustomEnumValidator({ validEnum: ['desc', 'asc'], optional: true })
  sortDirection: 'desc' | 'asc' = 'desc';
}
