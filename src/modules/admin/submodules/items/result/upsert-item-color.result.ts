import { ApiProperty } from '@nestjs/swagger';
import { BaseResultWithData } from '../../../../../results/baseResultWithData.result';
import { ItemColorDTO } from '../../../../items/results/add-item-to-cart.result';

export class UpsertItemColorResult extends BaseResultWithData {
  @ApiProperty({ type: ItemColorDTO })
  data: ItemColorDTO;

  static from(
    data: ItemColorDTO,
    message: string,
    status: number,
  ): UpsertItemColorResult {
    return new BaseResultWithData(status, message, data);
  }
}
