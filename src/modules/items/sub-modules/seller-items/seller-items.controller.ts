import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiResponse } from '@nestjs/swagger';
import { FormDataRequest } from 'nestjs-form-data';
import { CheckUserType } from '../../../../common/decorators/check-user-group.decorator';
import {
  GetCurrentUser,
  UserDTO,
} from '../../../../common/decorators/get-current-user-id.decorator';
import { USER_TYPE } from '../../../../common/enum/user-types.enum';
import { SubmitItemDTO } from '../../dto/sumbit-items.dto';
import { SellerItemService } from './seller-items.service';

@Controller('seller-item')
export class SellerItemsController {
  constructor(private readonly sellerItemService: SellerItemService) {}

  @Post('')
  @CheckUserType(USER_TYPE.SELLER)
  @ApiBearerAuth()
  @FormDataRequest({ autoDeleteFile: true, limits: { files: 4 } })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 200,
    type: SubmitItemDTO,
  })
  async createCategory(
    @Body() details: SubmitItemDTO,
    @GetCurrentUser() { sellerProfileId }: UserDTO,
  ) {
    return this.sellerItemService.submitItem(details, sellerProfileId);
  }
}
