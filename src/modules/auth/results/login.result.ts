import { ApiProperty } from '@nestjs/swagger';
import { BaseResultWithData } from '../../../results/baseResultWithData.result';
import { UserRegisterResultDTO } from './register.result';
import { JWT_Tokens } from '../dto/register.dto';

export class SellerLoginResultDTO extends UserRegisterResultDTO {
  @ApiProperty({ type: JWT_Tokens })
  tokens: JWT_Tokens;
}

export class SellerLoginResult extends BaseResultWithData {
  @ApiProperty({ type: SellerLoginResult })
  data: SellerLoginResultDTO;

  static from(
    data: SellerLoginResultDTO,
    message: string,
    status: number,
  ): SellerLoginResult {
    return { ...new BaseResultWithData(status, message, data), data };
  }
}


export class BuyerLoginResultDTO extends UserRegisterResultDTO {
  @ApiProperty({ type: JWT_Tokens })
  tokens: JWT_Tokens;
}

export class BuyerLoginResult extends BaseResultWithData {
  @ApiProperty({ type: BuyerLoginResultDTO })
  data: BuyerLoginResultDTO;

  static from(
    data: BuyerLoginResultDTO,
    message: string,
    status: number,
  ): BuyerLoginResult {
    return { ...new BaseResultWithData(status, message, data), data };
  }
}
