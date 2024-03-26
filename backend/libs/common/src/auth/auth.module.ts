import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { Queues, RmqModule } from '../rmq';
@Module({
  imports: [RmqModule.register({ name: Queues.AUTH }, { name: Queues.ROLES })],
  exports: [RmqModule],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieParser()).forRoutes('*');
  }
}
