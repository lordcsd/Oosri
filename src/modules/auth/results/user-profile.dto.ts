import { ApiProperty } from '@nestjs/swagger';
import { BaseResultWithData } from '../../../results/baseResultWithData.result';

export class UserProfileResultDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty()
  country: string;

  @ApiProperty()
  countryCode: string;

  @ApiProperty()
  profileImage: string;

  @ApiProperty()
  walletBalance: number;

  @ApiProperty()
  createdAt: Date;
}

export class UserProfileResult extends BaseResultWithData {
  @ApiProperty({ type: UserProfileResultDTO })
  data: UserProfileResultDTO;

  static from(
    data: UserProfileResultDTO,
    status: number,
    message: string,
  ): UserProfileResult {
    return { ...new BaseResultWithData(status, message, data), data };
  }
}
