import { DynamicModule, Module } from '@nestjs/common';
import { SellerItemsService } from './seller-items.service';
import { SellerItemsController } from './seller-items.controller';
import { DynamicModulesOptions } from 'src/common/dtos/dynamic-module-options';

@Module({
  imports: [],
  providers: [SellerItemsService],
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
