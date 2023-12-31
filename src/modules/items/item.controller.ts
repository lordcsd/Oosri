import { Body, Controller, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ItemService } from './item.service';
import { Public } from '../../common/decorators/public.decorator';
import { CategoryAndBrandsResult } from './results/category-and-brand.result';
import { GetItemsDTO } from './dto/get-items.dto';
import { ManyItemsResult } from './results/get-items.result';
import { CheckUserType } from '../../common/decorators/check-user-group.decorator';
import { USER_TYPE } from '../../common/enum/user-types.enum';
import {
  GetCurrentUser,
  GetCurrentUserId,
  UserDTO,
} from '../../common/decorators/get-current-user-id.decorator';
import { GetCartResult } from './results/add-item-to-cart.result';
import { FormDataRequest } from 'nestjs-form-data';
import { SubmitItemDTO } from './dto/sumbit-items.dto';
import { ItemColorsResult } from './results/get-colors.result';
import { GetColorsDTO } from './dto/get-colors.dto';
import { Hybrid } from '../../common/decorators/hybrid.decorator';
import { AddItemsToCartDTO, RateItemDTO } from './dto/item.dto';
import { IdDTO, IdsDTO } from '../../common/dtos/id.dto';

@Controller('items')
@ApiTags('Items')
export class ItemController {
  constructor(private readonly itemService: ItemService) { }



  @Get('categories-and-brands')
  @Public()
  @ApiResponse({ status: 201, type: CategoryAndBrandsResult })
  async getCategoriesAndBrands() {
    return await this.itemService.getCategoriesAndBrands();
  }

  @Get('many')
  @Hybrid()
  @CheckUserType(USER_TYPE.BUYER)
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    type: ManyItemsResult,
  })
  async getItems(
    @Query() queries: GetItemsDTO,
    @GetCurrentUserId() userId: number,
  ) {
    return await this.itemService.getItems(queries, userId);
  }

  @Put('add-to-cart')
  @CheckUserType(USER_TYPE.BUYER)
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    type: GetCartResult,
  })
  async addToCart(
    @GetCurrentUserId() id: number,
    @Body() payload: AddItemsToCartDTO,
  ) {
    return this.itemService.addItemToCart(payload, id);
  }

  @Get('cart')
  @CheckUserType(USER_TYPE.BUYER)
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    type: GetCartResult,
  })
  async getCart(@GetCurrentUser() { id }: UserDTO) {
    return this.itemService.getCart(id);
  }

  @Patch('remove-from-cart')
  @CheckUserType(USER_TYPE.BUYER)
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    type: GetCartResult,
  })
  async removeFromCart(
    @GetCurrentUserId() id: number,
    @Body() { ids }: IdsDTO,
  ) {
    return this.itemService.removeFromCart(ids, id);
  }

  @Patch('cart-item-units')
  @ApiResponse({
    status: 201,
    type: GetCartResult,
  })
  @CheckUserType(USER_TYPE.BUYER)
  @ApiBearerAuth()
  async UpdateCartItemUnits(
    @GetCurrentUserId() id: number,
    @Body() payload: AddItemsToCartDTO,
  ) {
    return this.itemService.updateCartItemUnit(payload, id);
  }

  @Get('colors')
  @Public()
  @ApiResponse({
    type: ItemColorsResult,
    status: 201,
  })
  async getColors(@Query() options: GetColorsDTO) {
    return this.itemService.getColors(options);
  }

  @Post('rate-item/:id')
  @CheckUserType(USER_TYPE.BUYER)
  @ApiBearerAuth()
  async rateItem(
    @Param() { id }: IdDTO,
    @GetCurrentUserId() userId: number,
    @Body() payload: RateItemDTO
  ) {
    return this.itemService.rateItem(
      id, userId, payload
    )
  }

}
