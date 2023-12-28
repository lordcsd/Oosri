import { DynamicModule, Module } from '@nestjs/common';
import { DynamicModulesOptions } from '../../../../common/dtos/dynamic-module-options';
import { SellerItemService } from './seller-items.service';
import { SellerItemsController } from './seller-items.controller';
import { MediaModule } from '../../../../utils/media/media.module';

@Module({
  imports: [MediaModule],
  providers: [SellerItemService],
})
export class SellerItemsModule {
  static register({
    renderControllers = false,
  }: DynamicModulesOptions): DynamicModule {
    return {
      ...(renderControllers && {
        controllers: [SellerItemsController],
      }),
      module: SellerItemsModule,
    };
  }
}
