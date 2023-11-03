import {
  CustomEnumValidator,
  CustomStringValidator,
} from 'nestjs-custom-class-validators';
import { LoginDTO } from '../../../../auth/dto/register.dto';
import { ADMIN_TYPE } from '../../../../../common/enum/admin-types.enum';

export class CreateAdminDTO extends LoginDTO {
  @CustomStringValidator({})
  name: string;

  @CustomEnumValidator({ validEnum: ADMIN_TYPE })
  type: ADMIN_TYPE;
}
