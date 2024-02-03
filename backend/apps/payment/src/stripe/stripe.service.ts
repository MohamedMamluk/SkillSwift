import { CreateChargeDto } from '@app/common';
import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private readonly stripe: Stripe;

  constructor(private readonly apiKey: string) {
    this.stripe = new Stripe(this.apiKey, {
      apiVersion: '2023-10-16',
    });
  }
  async test() {
    console.log('injected');
    return 'injected';
  }
  async createPayment(createCharge: CreateChargeDto) {
    const paymentMethod = await this.stripe.paymentMethods.create({
      type: 'card',
      card: {
        token: 'tok_visa',
      },
    });
    const paymentIntent = await this.stripe.paymentIntents.create({
      payment_method: paymentMethod.id,
      amount: createCharge.amount + 1 * 100,
      payment_method_types: ['card'],
      currency: 'usd',
    });
    return paymentIntent;
  }

  async abortPayment(paymentId: string) {
    console.log(paymentId);
    return this.stripe.refunds.create({
      payment_intent: paymentId,
    });
  }

  async confirmPayment(paymentId: string) {
    console.log(paymentId);
    return this.stripe.paymentIntents.confirm(paymentId);
  }
}
