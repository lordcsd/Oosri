import { CustomEnumValidator } from 'nestjs-custom-class-validators';
import { USER_TYPE } from '../../../common/enum/user-types.enum';

export class GoogleUserTypeDTO {
  @CustomEnumValidator({ validEnum: USER_TYPE })
  type: USER_TYPE;
}

export class SaveGoogleUserDTO {
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  tempToken: string
}
