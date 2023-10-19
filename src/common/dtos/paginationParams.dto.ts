import { CustomNumberValidator } from 'nestjs-custom-class-validators';

export class PaginationParamsDTO {
  @CustomNumberValidator({ defaultValue: 1, optional: true })
  page: number = 1;

  @CustomNumberValidator({ defaultValue: 10, optional: true })
  limit: number = 10;
}
