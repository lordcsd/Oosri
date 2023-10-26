import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaService } from './prisma.service';
import { MemoryStoredFile, NestjsFormDataModule } from 'nestjs-form-data';
import { configConstants } from '../../config/configConstants';

const providersAndExports = [PrismaService];

const jwt = JwtModule.registerAsync({
  imports: [ConfigModule],
  useFactory: async (configServeice: ConfigService) => ({
    secret: configServeice.get(configConstants.jwt.secret),
    signOptions: { expiresIn: '3h' },
  }),
  inject: [ConfigService],
});

@Global()
@Module({
  imports: [
    jwt,
    NestjsFormDataModule.config({
      storage: MemoryStoredFile,
      autoDeleteFile: true,
    }),
  ],
  providers: [...providersAndExports],
  exports: [...providersAndExports, jwt, NestjsFormDataModule],
})
export class SharedModule {}
