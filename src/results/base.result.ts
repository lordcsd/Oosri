import { ApiProperty } from '@nestjs/swagger';

export class BaseResult {
  @ApiProperty({ type: Number })
  status: number;

  @ApiProperty({ type: String })
  message: string;

  constructor(status: number, message: string) {
    this.status = status;
    this.message = message;
  }
}
