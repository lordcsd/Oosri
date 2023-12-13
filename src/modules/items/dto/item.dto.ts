import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsInt,
  IsOptional,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { CustomNumberValidator, CustomStringValidator } from 'nestjs-custom-class-validators';

export class ItemDTO {
  @ApiProperty({ type: Number })
  @IsInt()
  id: number;

  @ApiProperty({ type: Number, default: 1 })
  @IsInt()
  @Min(1)
  @IsOptional()
  units: number = 1;
}

export class AddItemsToCartDTO {
  @ApiProperty({ type: ItemDTO, isArray: true })
  @ValidateNested({ each: true })
  @Type(() => ItemDTO)
  @ArrayMinSize(1)
  items: ItemDTO[];
}


export class RateItemDTO {
  @CustomNumberValidator({})
  @Min(1)
  @Max(5)
  stars: number

  @CustomStringValidator({})
  comment: string
}