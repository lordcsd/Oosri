import { SetMetadata } from '@nestjs/common';

export const isHybrid = 'isHybrid';
export const Hybrid = () => SetMetadata(isHybrid, true);
