import { ApiProperty } from '@nestjs/swagger';
import { BaseResultWithData } from '../../../results/baseResultWithData.result';

class BrandDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  imageUrl: string;
}

export class CategoryAndBrandResultDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  imageUrl: string;

  @ApiProperty({ type: BrandDTO, isArray: true })
  brands: BrandDTO[];
}

export class CategoryAndBrandsResult extends BaseResultWithData {
  @ApiProperty({ type: CategoryAndBrandResultDTO, isArray: true })
  data: CategoryAndBrandResultDTO[];

  static from(
    data: CategoryAndBrandResultDTO[],
    status: number,
    message: string,
  ): CategoryAndBrandsResult {
    return { ...new BaseResultWithData(status, message, data), data };
  }
}
