import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Queues } from '../rmq';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(Queues.ROLES) private rolesClient: ClientProxy,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<number[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const user = this.getUser(context);
    const roleData = await lastValueFrom(
      this.rolesClient.send('get_role_data', {
        _id: user.role || '6602b01272a66b9a42fac6a3',
      }),
    );
    console.log(roleData);
    return requiredRoles.some((role) => roleData.level === role);
  }

  private getUser(context: ExecutionContext) {
    let user;
    const contextType = context.getType();
    if (contextType === 'rpc') {
      user = context.switchToRpc().getData().user;
    } else if (contextType === 'http') {
      user = context.switchToHttp().getRequest().user;
    }
    return user;
  }
}
