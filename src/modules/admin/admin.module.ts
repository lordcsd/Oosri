import { Module } from '@nestjs/common';
import { AdminAuthModule } from './submodules/auth/auth.module';
import { AdminItemModule } from './submodules/items/item.module';

@Module({
  imports: [
    AdminAuthModule.register({ renderControllers: true }),
    AdminItemModule.register({ renderControllers: true }),
  ],
})
export class AdminModule {}
