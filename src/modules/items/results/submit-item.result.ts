import { ApiProduces, ApiProperty } from '@nestjs/swagger';
import { ITEM_CONDITION, ITEM_SUBMISSION_STATUS } from '@prisma/client';
import { BaseResultWithData } from '../../../results/baseResultWithData.result';
import { SubmitItemDTO } from '../dto/sumbit-items.dto';

class ItemMediaDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  url: string;
}

export class SubmittedItemDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  unitsLeft: number;

  @ApiProperty()
  colorId: number;

  @ApiProperty()
  brandId: number;

  @ApiProperty()
  sellerId: number;

  @ApiProperty()
  status: ITEM_SUBMISSION_STATUS;

  @ApiProperty()
  condition: ITEM_CONDITION;

  @ApiProperty({ type: ItemMediaDTO })
  media?: ItemMediaDTO;
}

export class SubmitItemResult extends BaseResultWithData {
  @ApiProperty({ type: SubmitItemDTO })
  data: SubmittedItemDTO;

  static from(
    data: SubmittedItemDTO,
    message: string,
    status: 200,
  ): SubmitItemResult {
    return new BaseResultWithData(status, message, data);
  }
}
