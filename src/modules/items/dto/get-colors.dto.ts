import { CustomStringValidator } from 'nestjs-custom-class-validators';

export class GetColorsDTO {
  @CustomStringValidator({ optional: true })
  search?: string;
}
