import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsInt,
  IsOptional,
  Min,
  ValidateNested,
} from 'class-validator';

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
