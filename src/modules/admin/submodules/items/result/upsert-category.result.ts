import { ApiProperty } from '@nestjs/swagger';
import { BaseResultWithData } from '../../../../../results/baseResultWithData.result';

export class UpsertCategoryResultDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  imageUrl: string;
}

export class UpsertCategoryResult extends BaseResultWithData {
  @ApiProperty({ type: UpsertCategoryResultDTO })
  data: UpsertCategoryResultDTO;

  static from(
    data: UpsertCategoryResultDTO,
    message: string,
    status: number,
  ): UpsertCategoryResult {
    return new BaseResultWithData(status, message, data);
  }
}

export class UpsertBrandResultDTO extends UpsertCategoryResultDTO {
  @ApiProperty()
  categoryId: number;
}

export class UpsertBrandResult extends BaseResultWithData {
  @ApiProperty({ type: UpsertBrandResultDTO })
  data: UpsertBrandResultDTO;

  static from(
    data: UpsertBrandResultDTO,
    status: number,
    message: string,
  ): UpsertBrandResult {
    return new BaseResultWithData(status, message, data);
  }
}
