import { DynamicModule, Module } from '@nestjs/common';
import { DynamicModulesOptions } from '../../../../common/dtos/dynamic-module-options';
import { AdminAuthController } from './auth.controller';
import { AdminAuthService } from './auth.service';
import { AuthModule } from '../../../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [AdminAuthService],
})
export class AdminAuthModule {
  static register({
    renderControllers = false,
  }: DynamicModulesOptions): DynamicModule {
    return {
      ...(renderControllers && { controllers: [AdminAuthController] }),
      module: AdminAuthModule,
    };
  }
}
