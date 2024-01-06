import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNumber, IsNumberString, Length } from 'class-validator';
import {
  CustomPasswordDecorator,
  CustomStringValidator,
} from 'nestjs-custom-class-validators';

export class ForgotPasswordDTO {
  @IsEmail({})
  @ApiProperty()
  email: string;
}

export class EmailVerificationDTO extends ForgotPasswordDTO {
  @IsNumberString({})
  @Length(4)
  @Transform(({ value }) => (typeof value == 'number' ? `${value}` : value))
  @CustomStringValidator({})
  code: string;
}

export class CompleteForgotPasswordDTO extends ForgotPasswordDTO {
  @CustomStringValidator({})
  token: string;

  @CustomPasswordDecorator({})
  newPassword: string;
}

export class ResetPasswordDTO {
  @CustomPasswordDecorator({})
  oldPassword: string;

  @CustomPasswordDecorator({})
  newPassword: string;
}
