import { ApiProperty } from '@nestjs/swagger';
import { BaseResultWithData } from '../../../../../results/baseResultWithData.result';
import { JWT_Tokens } from '../../../../auth/dto/register.dto';
import { CreateAdminResultDTO } from './create-admin.result';

export class AdminLoginResultDTO extends CreateAdminResultDTO {
  @ApiProperty({ type: JWT_Tokens })
  tokens: JWT_Tokens;
}

export class AdminLoginResult extends BaseResultWithData {
  @ApiProperty({ type: AdminLoginResultDTO })
  data: AdminLoginResultDTO;

  static from(
    data: AdminLoginResultDTO,
    status: number,
    message: string,
  ): AdminLoginResult {
    return new BaseResultWithData(status, message, data);
  }
}
