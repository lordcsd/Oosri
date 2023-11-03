import { ApiProperty } from '@nestjs/swagger';
import { BaseResultWithData } from '../../../results/baseResultWithData.result';

export class ItemColorsDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  hexcode: string;
}

export class ItemColorsResult extends BaseResultWithData {
  @ApiProperty({ type: ItemColorsDTO , isArray:true})
  data: ItemColorsDTO[];

  static from(
    data: ItemColorsDTO[],
    status: number,
    message: string,
  ): ItemColorsResult {
    return new BaseResultWithData(status, message, data);
  }
}
