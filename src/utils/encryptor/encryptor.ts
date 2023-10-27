import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { IEncryptor } from './encryptor.interface';
import { ConfigService } from '@nestjs/config';
import { configConstants } from '../../config/configConstants';

@Injectable()
export class Encryptor implements IEncryptor {
  constructor(private readonly configService: ConfigService) {}

  get _key() {
    return this.configService.get(configConstants.encryptor.key);
  }

  private readonly _algorithm = 'aes-256-cbc';

  private readonly _iv = crypto.randomBytes(16);

  encrypt(text: string): string {
    const cipher = crypto.createCipheriv(this._algorithm, this._key, this._iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    return `${this._iv.toString('hex')}:${encrypted.toString('hex')}`;
  }

  decrypt(encryptedText: string): string {
    try {
      const textParts = encryptedText.split(':');
      const iv = Buffer.from(textParts.shift(), 'hex');
      const encryptedTextBuffer = Buffer.from(textParts.join(':'), 'hex');
      const decipher = crypto.createDecipheriv(this._algorithm, this._key, iv);
      const decrypted = Buffer.concat([
        decipher.update(encryptedTextBuffer),
        decipher.final(),
      ]);
      return decrypted.toString();
    } catch (error) {
      return '';
    }
  }
}
