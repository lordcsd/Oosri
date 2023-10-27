import { ApiProperty } from '@nestjs/swagger';
import { BaseResultWithData } from '../../../results/baseResultWithData.result';

export class UserRegisterResultDTO {
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
  countryCode: string;

  @ApiProperty()
  country: string;
}

export class RegisterResult extends BaseResultWithData {
  @ApiProperty({ type: UserRegisterResultDTO })
  data: UserRegisterResultDTO;

  static from(
    data: UserRegisterResultDTO,
    message: string,
    status: number,
  ): RegisterResult {
    return { ...new BaseResultWithData(status, message, data), data };
  }
}
