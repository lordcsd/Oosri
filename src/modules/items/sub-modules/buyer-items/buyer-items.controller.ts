import { Controller, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { BuyerItemsService } from './buyer-items.service';
import { USER_TYPE } from '../../../../common/enum/user-types.enum';
import { CheckUserType } from '../../../../common/decorators/check-user-group.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import {
  GetCurrentUser,
  UserDTO,
} from '../../../../common/decorators/get-current-user-id.decorator';
import { IdDTO } from '../../../../common/dtos/id.dto';

@Controller('buyer/items')
export class BuyerItemsController {
  constructor(private readonly buyerItemService: BuyerItemsService) {}

  @CheckUserType(USER_TYPE.BUYER)
  @ApiBearerAuth()
  @Patch('toggle-favorite/:id')
  async addToFavorite(
    @Param() { id }: IdDTO,
    @GetCurrentUser() { buyerProfileId }: UserDTO,
  ) {
    return this.buyerItemService.toggleFavorite(buyerProfileId, id);
  }
}
