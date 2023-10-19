import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, ValidateIf } from 'class-validator';
import { HasMimeType, IsFile, MaxFileSize } from 'nestjs-form-data';

export const allowedFileFormats = [
  'image/jpg',
  'image/jpeg',
  'image/png',
  'image/jfif',
  'image/gif',
  'image/svg+xml',
  'image/webp',
];

export const mimetypeError = `Image must be of type ${allowedFileFormats
  .map((_type) => _type.split('/')[1])
  .join(' or ')}`;

export class SingleImageUploadDTO {
  @IsFile()
  @MaxFileSize(2.5e7, { message: 'Image must be less than 25 megabytes' })
  @HasMimeType(allowedFileFormats, { message: mimetypeError })
  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: true,
  })
  image: Express.Multer.File;
}

export class SingleOptionalImageUploadDTO {
  @IsFile()
  @MaxFileSize(2.5e7, { message: 'Image must be less than 25 megabytes' })
  @HasMimeType(allowedFileFormats, { message: mimetypeError })
  @IsOptional()
  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
  })
  @ValidateIf((obj) => obj.image)
  image: Express.Multer.File;
}

export class MultipleImagesUploadDTO {
  @IsFile({ each: true })
  @MaxFileSize(2.5e7, {
    message: 'Images must be less than 25 megabytes',
    each: true,
  })
  @HasMimeType(allowedFileFormats, {
    message: mimetypeError,
    each: true,
  })
  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: true,
    isArray: true,
  })
  image: Express.Multer.File;
}
