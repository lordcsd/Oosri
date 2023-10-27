import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail } from 'class-validator';
import {
  CustomPasswordDecorator,
  CustomStringValidator,
} from 'nestjs-custom-class-validators';

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
