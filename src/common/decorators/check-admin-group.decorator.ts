import { SetMetadata } from '@nestjs/common';
import { ADMIN_TYPE } from '../enum/admin-types.enum';

export const CHECK_ADMIN_TYPE = 'check_admin_type';
export const CheckAdminType = (...types: ADMIN_TYPE[]) =>
  SetMetadata(CHECK_ADMIN_TYPE, types);
