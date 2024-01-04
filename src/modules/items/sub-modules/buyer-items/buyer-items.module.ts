import { DynamicModule, Module } from '@nestjs/common';
import { BuyerItemsService } from './buyer-items.service';
import { DynamicModulesOptions } from '../../../../common/dtos/dynamic-module-options';
import { BuyerItemsController } from './buyer-items.controller';

@Module({ providers: [BuyerItemsService] })
export class BuyerItemModule {
  static register({
    renderControllers = false,
  }: DynamicModulesOptions): DynamicModule {
    return {
      module: BuyerItemModule,
      ...(renderControllers && {
        controllers: [BuyerItemsController],
      }),
    };
  }
}
