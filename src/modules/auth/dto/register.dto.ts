import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsPhoneNumber } from 'class-validator';
import {
  CustomEnumValidator,
  CustomPasswordDecorator,
  CustomStringValidator,
} from 'nestjs-custom-class-validators';
import { USER_TYPE } from '../../../common/enum/user-types.enum';

export class JWT_Tokens {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}

export class LoginDTO {
  @CustomStringValidator({})
  @IsEmail()
  @Transform(({ value }: { value: string }) => value.trim().toLowerCase())
  email: string;

  @CustomPasswordDecorator({})
  password: string;
}

export class RegisterDTO extends LoginDTO {
  @CustomStringValidator({})
  firstName: string;

  @CustomStringValidator({})
  lastName: string;

  @CustomStringValidator({})
  phoneNumber: string;

  @CustomStringValidator({})
  countryCode: string;

  @CustomStringValidator({})
  country: string;
}

export class CompeteSignInOrRegisterWithGoogleDTO {
  @CustomStringValidator({})
  token: string;

  @CustomEnumValidator({ validEnum: USER_TYPE })
  userType: USER_TYPE;

  @CustomStringValidator({ optional: true })
  @IsPhoneNumber()
  phoneNumber: string;

  @CustomStringValidator({ optional: true })
  countryCode: string;

  @CustomStringValidator({ optional: true })
  country: string;
}
