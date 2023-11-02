import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsInt } from 'class-validator';

export class ItemIdsDTO {
  @ApiProperty({ type: String, isArray: true })
  @IsInt({ each: true })
  @ArrayMinSize(1)
  ids: number[];
}
