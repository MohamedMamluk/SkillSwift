import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable, catchError, tap } from 'rxjs';
import { Queues } from '../rmq';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(@Inject(Queues.AUTH) private authClient: ClientProxy) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const authentication = this.getAuthentication(context);
    return this.authClient
      .send('validate_user', {
        Authentication: authentication,
      })
      .pipe(
        tap((user) => {
          this.addUser(user, context);
        }),
        catchError(() => {
          throw new UnauthorizedException();
        }),
      );
  }

  private getAuthentication(context: ExecutionContext) {
    const contextType = context.getType();
    let authentication: string;
    if (contextType === 'rpc') {
      authentication = context.switchToRpc().getData().Authentication;
    } else if (contextType === 'http') {
      authentication = context.switchToHttp().getRequest().cookies
        ?.Authentication;
    }
    if (!authentication) {
      throw new UnauthorizedException(
        'No value was provided for Authentication',
      );
    }
    return authentication;
  }

  private addUser(user: any, context: ExecutionContext) {
    const contextType = context.getType();
    if (contextType === 'rpc') {
      context.switchToRpc().getData().user = user;
    } else if (contextType === 'http') {
      context.switchToHttp().getRequest().user = user;
    }
  }
}
