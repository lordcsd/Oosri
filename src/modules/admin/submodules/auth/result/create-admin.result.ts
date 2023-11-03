import { ApiProperty } from '@nestjs/swagger';
import { BaseResultWithData } from '../../../../../results/baseResultWithData.result';

export class CreateAdminResultDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  createdAt: Date;
}

export class CreateAdminResult extends BaseResultWithData {
  @ApiProperty({ type: CreateAdminResultDTO })
  data: CreateAdminResultDTO;

  static from(
    data: CreateAdminResultDTO,
    message: string,
    status: number,
  ): CreateAdminResult {
    return new BaseResultWithData(status, message, data);
  }
}
