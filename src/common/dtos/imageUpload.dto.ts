import { Optional, UnprocessableEntityException } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, ValidateIf } from 'class-validator';
import { HasMimeType, IsFile, MaxFileSize } from 'nestjs-form-data';
import { TransformUnrapImageObj } from '../../utils/media/utils/validatorTransformers';

export interface FormImageStruct {
  originalName: string;
  encoding: string;
  busBoyMimeType: string;
  buffer: Buffer;
  size: number;
  ['']?: FormImageStruct;
}

export class MediaUploadDTO {
  @IsFile({ each: true })
  @MaxFileSize(1e10, { each: true })
  @Transform(TransformUnrapImageObj)
  @HasMimeType(
    [
      'image/jpg',
      'image/jpeg',
      'image/png',
      'image/jfif',
      'image/gif',
      'video/mp4',
      'video/3gpp',
      'video/webm',
    ],
    { each: true },
  )
  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: true,
    isArray: true,
  })
  media?: Express.Multer.File[];
}

export class MediaOptionalUploadDTO {
  @ValidateIf((obj, media) => obj[media])
  @IsFile({ each: true })
  @MaxFileSize(1e10, { each: true })
  @Transform(TransformUnrapImageObj)
  @HasMimeType(
    [
      'image/jpg',
      'image/jpeg',
      'image/png',
      'image/jfif',
      'image/gif',
      'video/mp4',
      'video/3gpp',
      'video/webm',
    ],
    { each: true },
  )
  @Optional()
  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    required: true,
    isArray: true,
  })
  media?: Express.Multer.File[];
}

export class SingleImageUploadDTO {
  @IsFile()
  @MaxFileSize(1e10)
  @HasMimeType([
    'image/jpg',
    'image/jpeg',
    'image/png',
    'image/jfif',
    'image/gif',
  ])
  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: true,
  })
  image: Express.Multer.File;
}

export class SingleOptionalImageUploadDTO {
  @IsFile()
  @MaxFileSize(1e10)
  @HasMimeType([
    'image/jpg',
    'image/jpeg',
    'image/png',
    'image/jfif',
    'image/gif',
  ])
  @IsOptional()
  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    required: true,
  })
  image?: Express.Multer.File;
}
