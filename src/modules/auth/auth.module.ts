import { DynamicModule, Module } from '@nestjs/common';
import { JwtStrategy } from './strategies/jwt.strategy';
import { DynamicModulesOptions } from '../../common/dtos/dynamic-module-options';
import { AuthService } from './auth.service';
import { AuthBuyerController, AuthSellerController } from './auth.controller';

@Module({ imports: [], providers: [JwtStrategy, AuthService] })
export class AuthModule {
  static register({
    renderControllers = true,
  }: DynamicModulesOptions): DynamicModule {
    return {
      ...(renderControllers && {
        controllers: [AuthSellerController, AuthBuyerController],
      }),
      module: AuthModule,
    };
  }
}
