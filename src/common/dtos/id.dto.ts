import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, ValidateNested } from 'class-validator';
import { CustomNumberValidator } from 'nestjs-custom-class-validators';

export class IdDTO {
  @CustomNumberValidator({})
  id: number;
}

export class IdsDTO {
  @ValidateNested({ each: true })
  @IsNumber({}, { each: true })
  @ApiProperty()
  ids: number[];
}
