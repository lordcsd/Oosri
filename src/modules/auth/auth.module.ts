import { Module } from '@nestjs/common';
import { SharedModule } from '../shared/shared.module';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({ imports: [SharedModule], providers: [JwtStrategy] })
export class AuthModule {}
