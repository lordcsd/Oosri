import {
  CustomNumberValidator,
  CustomStringValidator,
} from 'nestjs-custom-class-validators';
import { SingleOptionalImageUploadDTO } from '../../../../../common/dtos/imageUpload.dto';
import { IsHexColor } from 'class-validator';

export class UpsertCategoryDTO extends SingleOptionalImageUploadDTO {
  @CustomNumberValidator({ optional: true })
  id?: number;

  @CustomStringValidator({ optional: true })
  name?: string;
}

export class UpsertBrandDTO extends UpsertCategoryDTO {
  @CustomNumberValidator({ optional: true })
  categoryId?: number;
}

export class UpsertItemColorDTO {
  @CustomNumberValidator({ optional: true })
  id?: number;

  @CustomStringValidator({ optional: true })
  name?: string;

  @CustomStringValidator({ optional: true })
  @IsHexColor()
  hexcode?: string;
}
