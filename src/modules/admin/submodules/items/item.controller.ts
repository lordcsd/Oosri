import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminItemService } from './items.service';
import {
  UpsertBrandDTO,
  UpsertCategoryDTO,
  UpsertItemColorDTO,
} from './dto/category-item.dto';
import { CheckAdminType } from '../../../../common/decorators/check-admin-group.decorator';
import { ADMIN_TYPE } from '../../../../common/enum/admin-types.enum';
import {
  UpsertBrandResult,
  UpsertCategoryResult,
} from './result/upsert-category.result';
import { BaseResult } from '../../../../results/base.result';
import { IdDTO } from '../../../../common/dtos/id.dto';
import { UpsertItemColorResult } from './result/upsert-item-color.result';
import { FormDataRequest } from 'nestjs-form-data';

@Controller('admin/item')
@ApiTags('Admin Item Management')
export class AdminItemController {
  constructor(private readonly itemService: AdminItemService) {}

  @Post('upsert-category')
  @ApiBearerAuth()
  @CheckAdminType(ADMIN_TYPE.ADMIN, ADMIN_TYPE.SUPER_ADMIN)
  @ApiResponse({
    status: 201,
    type: UpsertCategoryResult,
  })
  @FormDataRequest({ autoDeleteFile: true, limits: { files: 1 } })
  @ApiConsumes('multipart/form-data')
  async upsertCategory(@Body() payload: UpsertCategoryDTO) {
    return this.itemService.upsertCategory(payload);
  }

  @Delete('category/:id')
  @ApiBearerAuth()
  @CheckAdminType(ADMIN_TYPE.ADMIN, ADMIN_TYPE.SUPER_ADMIN)
  @ApiResponse({
    status: 200,
    type: BaseResult,
  })
  async deleteCategory(@Param() { id }: IdDTO) {
    return this.itemService.deleteCategory(id);
  }

  @Post('upsert-brand')
  @ApiBearerAuth()
  @CheckAdminType(ADMIN_TYPE.ADMIN, ADMIN_TYPE.SUPER_ADMIN)
  @ApiResponse({
    status: 201,
    type: UpsertBrandResult,
  })
  @FormDataRequest({ autoDeleteFile: true, limits: { files: 1 } })
  @ApiConsumes('multipart/form-data')
  async upsertBrand(@Body() payload: UpsertBrandDTO) {
    return this.itemService.upsertBrand(payload);
  }

  @Delete('brand/:id')
  @ApiBearerAuth()
  @CheckAdminType(ADMIN_TYPE.ADMIN, ADMIN_TYPE.SUPER_ADMIN)
  @ApiResponse({
    status: 200,
    type: BaseResult,
  })
  async deleteBrand(@Param() { id }: IdDTO) {
    return this.itemService.deleteBrand(id);
  }

  @Post('upsert-item-color')
  @ApiBearerAuth()
  @CheckAdminType(ADMIN_TYPE.ADMIN, ADMIN_TYPE.SUPER_ADMIN)
  @ApiResponse({
    status: 201,
    type: UpsertItemColorResult,
  })
  @FormDataRequest({ autoDeleteFile: true, limits: { files: 1 } })
  @ApiConsumes('multipart/form-data')
  async upsertColor(@Body() paylaod: UpsertItemColorDTO) {
    return this.itemService.upsertColor(paylaod);
  }

  @Delete('color/:id')
  @ApiBearerAuth()
  @CheckAdminType(ADMIN_TYPE.ADMIN, ADMIN_TYPE.SUPER_ADMIN)
  @ApiResponse({
    status: 200,
    type: BaseResult,
  })
  async deleteColor(@Param() { id }: IdDTO) {
    return this.itemService.deleteItemColor(id);
  }
}
