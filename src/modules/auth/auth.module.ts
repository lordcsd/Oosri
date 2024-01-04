import { DynamicModule, Module } from '@nestjs/common';
import { JwtStrategy } from './strategies/jwt.strategy';
import { DynamicModulesOptions } from '../../common/dtos/dynamic-module-options';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './strategies/google.strategy';

@Module({
  imports: [
    // PassportModule.register({ defaultStrategy: 'google', seesion: true }),
  ],
  providers: [
    JwtStrategy,
    AuthService,
    // GoogleStrategy
  ],
  exports: [AuthService],
})
export class AuthModule {
  static register({
    renderControllers = true,
  }: DynamicModulesOptions): DynamicModule {
    return {
      ...(renderControllers && {
        controllers: [AuthController],
      }),
      module: AuthModule,
    };
  }
}
