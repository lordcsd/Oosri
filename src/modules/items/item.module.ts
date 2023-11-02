import { DynamicModule, Module } from '@nestjs/common';
import { DynamicModulesOptions } from '../../common/dtos/dynamic-module-options';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { MediaModule } from '../../utils/media/media.module';

@Module({
  imports: [MediaModule],
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
