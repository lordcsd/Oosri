import { ITEM_CONDITION } from '@prisma/client';
import { BaseResultWithData } from '../../../results/baseResultWithData.result';
import { ApiProperty } from '@nestjs/swagger';
import { IdDTO } from '../../../common/dtos/id.dto';

export class IdAndNameDTO extends IdDTO {
  @ApiProperty()
  id: number;
}

export class ItemColorDTO extends IdAndNameDTO {
  @ApiProperty()
  hexcode: string;
}

export class CategoryResultDTO extends IdAndNameDTO {
  @ApiProperty()
  imageUrl: string;
}

export class BrandResultDTO extends IdAndNameDTO {
  @ApiProperty()
  imageUrl: string;

  @ApiProperty({ type: CategoryResultDTO })
  category: CategoryResultDTO;
}

export class ItemResultDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  condition: ITEM_CONDITION;

  @ApiProperty({ type: ItemColorDTO })
  color: ItemColorDTO;

  @ApiProperty()
  sellerId: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ type: BrandResultDTO })
  brand: BrandResultDTO;
}

export class CheckoutItemResultDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  units: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ type: ItemResultDTO })
  item: ItemResultDTO;
}

export class CartResultDTO {
  @ApiProperty()
  id: number;

  @ApiProperty({ type: CheckoutItemResultDTO, isArray: true })
  items: CheckoutItemResultDTO[];
}

export class GetCartResult extends BaseResultWithData {
  @ApiProperty({ type: CartResultDTO })
  data: CartResultDTO;

  static from(
    data: CartResultDTO,
    status: number,
    message: string,
  ): GetCartResult {
    return new BaseResultWithData(status, message, data);
  }
}
