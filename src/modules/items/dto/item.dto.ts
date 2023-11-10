import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsInt } from 'class-validator';

export class ItemIdsDTO {
  @ApiProperty({ type: Number, isArray: true })
  @IsInt({ each: true })
  @ArrayMinSize(1)
  ids: number[];
}
