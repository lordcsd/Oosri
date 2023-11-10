import { Body, Controller, Get, Patch, Post, Put, Query } from '@nestjs/common';
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
import { ItemIdsDTO } from './dto/item.dto';
import { GetCartResult } from './results/add-item-to-cart.result';
import { FormDataRequest } from 'nestjs-form-data';
import { SubmitItemDTO } from './dto/sumbit-items.dto';
import { ItemColorsResult } from './results/get-colors.result';
import { GetColorsDTO } from './dto/get-colors.dto';
import { Hybrid } from '../../common/decorators/hybrid.decorator';

@Controller('items')
@ApiTags('Items')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

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
    return this.itemService.submitItem(details, sellerProfileId);
  }

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
  async addToCart(@GetCurrentUserId() id: number, @Body() payload: ItemIdsDTO) {
    return this.itemService.addItemToCart(payload.ids, id);
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
  @ApiResponse({
    status: 201,
    type: GetCartResult,
  })
  async removeFromCart(
    @GetCurrentUserId() id: number,
    @Body() payload: ItemIdsDTO,
  ) {
    return this.itemService.removeFromCart(payload.ids, id);
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
}
