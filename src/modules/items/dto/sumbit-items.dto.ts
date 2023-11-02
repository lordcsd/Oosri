import {
  CustomEnumValidator,
  CustomNumberValidator,
  CustomStringValidator,
} from 'nestjs-custom-class-validators';
import { ITEM_CONDITION } from '@prisma/client';
import { MediaOptionalUploadDTO } from '../../../common/dtos/imageUpload.dto';

export class SubmitItemDTO extends MediaOptionalUploadDTO {
  @CustomStringValidator({})
  name: string;

  @CustomStringValidator({})
  description: string;

  @CustomNumberValidator({})
  price: number;

  @CustomNumberValidator({})
  units: number;

  @CustomNumberValidator({})
  colorId: number;

  @CustomNumberValidator({})
  brandId: number;

  @CustomEnumValidator({ validEnum: ITEM_CONDITION })
  condition: ITEM_CONDITION;
}
