import { Inject, Injectable } from '@nestjs/common';
import { StripeService } from './stripe/stripe.service';
import { CreateChargeDto } from '@app/common';

@Injectable()
export class PaymentService {
  constructor(@Inject(StripeService) private stripeService: StripeService) {}
  getHello(): string {
    return 'Hello World!';
  }
  async initiatePayment(createCharge: CreateChargeDto) {
    return this.stripeService.createPayment(createCharge);
  }
  async abortPayment(abort_payment: { paymentId: string }) {
    console.log(abort_payment);
    return this.stripeService.abortPayment(abort_payment.paymentId);
  }
}
