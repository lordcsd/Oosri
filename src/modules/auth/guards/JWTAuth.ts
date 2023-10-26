import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

export class MyAuthGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
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
