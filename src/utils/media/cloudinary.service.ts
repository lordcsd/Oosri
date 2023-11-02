import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import toStream = require('buffer-to-stream');
import { ConfigService } from '@nestjs/config';
import { configConstants } from '../../config/configConstants';

export enum MediaFolderEnum {
  PROFILE_IMAGE = 'profile-image',
  PRODUCT_MEDIA = 'product-media',
}

@Injectable()
export class CloudinaryService {
  name: string = configConstants.cloudinary.providerName;
  constructor(private readonly configService: ConfigService) {}

  async uploadMedia(
    file: Express.Multer.File,
    subFolder?: MediaFolderEnum,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const isVideo = file.mimetype.includes('video');

      const upload = v2.uploader.upload_stream(
        {
          ...(isVideo && { resource_type: 'video' }),
          folder: `${configConstants.cloudinary.projectFolder}/${
            subFolder ? subFolder : ''
          }`,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );
      toStream(file.buffer).pipe(upload);
    });
  }

  async uploadBase64String(
    file: string,
    subFolder?: MediaFolderEnum,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload(
        file,
        {
          folder: `${configConstants.cloudinary.projectFolder}/${
            subFolder ? subFolder : ''
          }`,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );
    });
  }

  async deleteMedia(id: string) {
    const deletedMedia = await v2.uploader.destroy(id);
    return deletedMedia;
  }

  async listMedia() {
    return await v2.api.resources({
      type: 'upload',
    });
  }
}
