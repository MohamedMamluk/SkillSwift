import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { OrdersRepository } from './orders.repository';
import { DatabaseModule, Queues, RmqModule } from '@app/common';
import { Order, orderSchema } from './schemas/orders.schema';
import { AuthModule } from '@app/common';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGO_URI: Joi.string().required(),
        PORT: Joi.string().required(),
      }),
    }),
    DatabaseModule,
    DatabaseModule.forFeature([{ name: Order.name, schema: orderSchema }]),
    RmqModule.register({ name: Queues.COURSES }, { name: Queues.PAYMENT }),
    AuthModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersRepository],
})
export class OrdersModule {}
