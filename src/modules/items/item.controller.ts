import { Controller, Get, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ItemService } from './item.service';
import { Public } from '../../common/decorators/public.decorator';
import { CategoryAndBrandsResult } from './results/category-and-brand.result';
import { GetItemsDTO } from './dto/get-items.dto';
import { ManyItemsResult } from './results/get-items.result';

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
}
