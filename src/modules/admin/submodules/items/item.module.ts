import { DynamicModule, Module } from '@nestjs/common';
import { AdminItemService } from './items.service';
import { DynamicModulesOptions } from '../../../../common/dtos/dynamic-module-options';
import { AdminItemController } from './item.controller';
import { MediaModule } from '../../../../utils/media/media.module';

@Module({
  imports: [MediaModule],
  providers: [AdminItemService],
})
export class AdminItemModule {
  static register({
    renderControllers = false,
  }: DynamicModulesOptions): DynamicModule {
    return {
      ...(renderControllers && { controllers: [AdminItemController] }),
      module: AdminItemModule,
    };
  }
}
