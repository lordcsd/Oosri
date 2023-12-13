import { DynamicModule, Module } from '@nestjs/common';
import { SellerItemsModule } from './sub-modules/seller-items/seller-items.module';
import { SellerService } from './seller.service';
import { DynamicModulesOptions } from 'src/common/dtos/dynamic-module-options';
import { SellerController } from './seller.controller';

@Module({
  imports: [SellerItemsModule.register({ renderControllers: true })],
  providers: [SellerService],
})
export class SellerModule {
  static register({
    renderControllers = false,
  }: DynamicModulesOptions): DynamicModule {
    return {
      ...(renderControllers && {
        controllers: [SellerController],
      }),
      module: SellerModule,
    };
  }
}
