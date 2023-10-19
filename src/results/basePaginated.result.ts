import { ApiProperty } from '@nestjs/swagger';
import { BaseResultWithData } from './baseResultWithData.result';

export class BasePaginatedResult {

  data: any[]

  @ApiProperty({ type: Number })
  page: number;

  @ApiProperty({ type: Number })
  limit: number;

  @ApiProperty({ type: Number })
  total: number;

  @ApiProperty({ type: Number })
  lastPage: number;

  static from(
    status: number,
    message: string,
    data: any,
    page: number,
    limit: number,
    total: number,
  ): BasePaginatedResult {
    let result = new BaseResultWithData(status, message, data);

    return {
      ...result,
      page,
      limit,
      total,
      lastPage: Math.ceil(total / limit),
    };
  }
}
