import { DynamicModule, Module } from '@nestjs/common';
import { DynamicModulesOptions } from '../../common/dtos/dynamic-module-options';
import { UserService } from './user.service';

@Module({
  providers: [UserService],
})
export class UserModule {
  static register({
    renderControllers = false,
  }: DynamicModulesOptions): DynamicModule {
    return {
      ...(renderControllers && { controllers: [] }),
      module: UserModule,
    };
  }
}
