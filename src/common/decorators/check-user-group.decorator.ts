import { SetMetadata } from '@nestjs/common';
import { USER_TYPE } from '../enum/user-types.enum';

export const CHECK_USER_TYPE = 'check_user_type';
export const CheckUserType = (...types: USER_TYPE[]) =>
  SetMetadata(CHECK_USER_TYPE, types);
