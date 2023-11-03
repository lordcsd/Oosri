import { CustomNumberValidator } from 'nestjs-custom-class-validators';

export class IdDTO {
  @CustomNumberValidator({})
  id: number;
}
