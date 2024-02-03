import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [
    {
      provide: StripeService,
      useFactory: (configService: ConfigService) => {
        return new StripeService(configService.get('STRIPE_SECRET_KEY'));
      },
      inject: [ConfigService],
    },
  ],
  exports: [StripeService],
})
export class StripeModule {}
