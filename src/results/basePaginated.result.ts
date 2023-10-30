import { ApiProperty } from '@nestjs/swagger';
import { BaseResultWithData } from './baseResultWithData.result';
import { BaseResult } from './base.result';

export interface ResultPaginationOptions {
  status: number;
  message: string;
  page: number;
  limit: number;
  total: number;
}

export class BasePaginatedResult extends BaseResult {
  data: any[];

  @ApiProperty({ type: Number })
  page: number;

  @ApiProperty({ type: Number })
  limit: number;

  @ApiProperty({ type: Number })
  total: number;

  @ApiProperty({ type: Number })
  lastPage: number = 1;

  constructor(data: any, options: ResultPaginationOptions) {
    super(options.status, options.message);
    this.data = data;
    this.page = options.page;
    this.limit = options.limit;
    this.total = options.total;
    this.lastPage = Math.ceil(options.total / options.limit);
  }
}
