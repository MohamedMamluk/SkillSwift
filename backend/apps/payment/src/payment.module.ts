import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import * as Joi from 'joi';
import { ConfigModule } from '@nestjs/config';
import { RmqModule } from '@app/common';
import { StripeModule } from './stripe/stripe.module';
import { AuthModule } from '@app/common';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_PAYMENT_QUEUE: Joi.string().required(),
        RABBIT_MQ_AUTH_QUEUE: Joi.string().required(),
        STRIPE_SECRET_KEY: Joi.string().required(),
      }),
    }),
    RmqModule,
    StripeModule,
    AuthModule,
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
