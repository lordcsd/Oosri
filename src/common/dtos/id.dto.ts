import { CustomStringValidator } from 'nestjs-custom-class-validators';

export class IdDTO {
  @CustomStringValidator({ isUUID: true })
  id: string;
}
