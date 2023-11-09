import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetCurrentUserId = createParamDecorator(
  (_: undefined, context: ExecutionContext): number => {
    const request = context.switchToHttp().getRequest();
    const user = request?.user as { id: number };

    return user?.id;
  },
);

export interface UserDTO {
  id: number;
  buyerProfileId?: number;
  sellerProfileId?: number;
}

export const GetCurrentUser = createParamDecorator(
  (_: undefined, context: ExecutionContext): UserDTO => {
    const request = context.switchToHttp().getRequest();
    const { id, buyerProfileId, sellerProfileId } = request.user as UserDTO;

    return { id, buyerProfileId, sellerProfileId };
  },
);
