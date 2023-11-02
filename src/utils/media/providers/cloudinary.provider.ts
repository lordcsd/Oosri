import { ConfigService } from '@nestjs/config';
import { v2 } from 'cloudinary';
import { configConstants } from '../../../config/configConstants';

export const CloudinaryProvider = {
  provide: configConstants.cloudinary.providerName,
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    return v2.config({
      cloud_name: configService.get<string>(configConstants.cloudinary.name),
      api_key: configService.get<string>(configConstants.cloudinary.apiKey),
      api_secret: configService.get<string>(
        configConstants.cloudinary.apiSecret,
      ),
    });
  },
};
