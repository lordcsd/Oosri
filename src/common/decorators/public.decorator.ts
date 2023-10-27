import { SetMetadata } from '@nestjs/common';
/**
 * Add this decorator to every endpoint that should be made public
 * i.e access without authorization
 * By default, all routes are protected
 */
export const Public = () => SetMetadata('isPublic', true);
