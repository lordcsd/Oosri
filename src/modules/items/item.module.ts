import { DynamicModule, Module } from '@nestjs/common';
import { DynamicModulesOptions } from '../../common/dtos/dynamic-module-options';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { MediaModule } from '../../utils/media/media.module';
import { SellerItemsModule } from './sub-modules/seller-items/seller-items.module';
import { BuyerItemModule } from './sub-modules/buyer-items/buyer-items.module';

@Module({
  imports: [
    MediaModule,
    SellerItemsModule.register({ renderControllers: true }),
    BuyerItemModule.register({ renderControllers: true }),
  ],
  providers: [ItemService],
})
export class ItemModule {
  static register({
    renderControllers = false,
  }: DynamicModulesOptions): DynamicModule {
    return {
      ...(renderControllers && { controllers: [ItemController] }),
      module: ItemModule,
    };
  }
}
