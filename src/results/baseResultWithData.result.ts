import { BaseResult } from './base.result';

export class BaseResultWithData extends BaseResult {
  public data: any;

  constructor(status: number, message: string, data: any) {
    super(status, message);
    this.data = data;
  }
}
