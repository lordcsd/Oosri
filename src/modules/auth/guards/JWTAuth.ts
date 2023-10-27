import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JWTAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    return super.canActivate(context);
  }

  handleRequest<TUser = any>(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
    status?: any,
  ): TUser {
    if (!user) {
      throw new UnauthorizedException();
    }

    // const adminFields = ['id', 'email', 'name', 'password', 'createdAt'];
    // const isAdmin =
    //   adminFields.sort().join() === Object.keys(user).sort().join();

    // if (isAdmin && this.roles.includes(roles.ADMIN)) {
    //   return user;
    // }

    // if (!isAdmin && this.roles.includes(roles.USER)) {
    //   return user;
    // }

    throw new UnauthorizedException();
  }
}
