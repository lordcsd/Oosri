import { IsNotEmpty } from 'class-validator';
import { CustomStringValidator } from 'nestjs-custom-class-validators';

export class RefreshTokenDTO {
  @CustomStringValidator({})
  @IsNotEmpty()
  refreshToken: string;
}
