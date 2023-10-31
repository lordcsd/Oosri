import { Body, Controller, Get, Patch, Put, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ItemService } from './item.service';
import { Public } from '../../common/decorators/public.decorator';
import { CategoryAndBrandsResult } from './results/category-and-brand.result';
import { GetItemsDTO } from './dto/get-items.dto';
import { ManyItemsResult } from './results/get-items.result';
import { CheckUserType } from '../../common/decorators/check-user-group.decorator';
import { USER_TYPE } from '../../common/enum/user-types.enum';
import { GetCurrentUserId } from '../../common/decorators/get-current-user-id.decorator';
import { ItemIdsDTO } from './dto/item.dto';
import { GetCartResult } from './results/add-item-to-cart.result';

@Controller('items')
@ApiTags('Items')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Get('categories-and-brands')
  @Public()
  @ApiResponse({ status: 201, type: CategoryAndBrandsResult })
  async getCategoriesAndBrands() {
    return await this.itemService.getCategoriesAndBrands();
  }

  @Get('many')
  @Public()
  @ApiResponse({
    status: 201,
    type: ManyItemsResult,
  })
  async getItems(@Query() queries: GetItemsDTO) {
    return await this.itemService.getItems(queries);
  }

  @Put('add-to-cart')
  @CheckUserType(USER_TYPE.BUYER)
  @ApiResponse({
    status: 201,
    type: GetCartResult,
  })
  async addToCart(@GetCurrentUserId() id: number, @Body() payload: ItemIdsDTO) {
    return this.itemService.addItemToCart(payload.ids, id);
  }

  @Patch('remove-from-cart')
  @CheckUserType(USER_TYPE.BUYER)
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
}
