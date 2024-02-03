import { Controller, Get, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateChargeDto } from '@app/common';
import { JwtAuthGuard } from '@app/common';

@Controller()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get()
  getHello(): string {
    return this.paymentService.getHello();
  }
  @UseGuards(JwtAuthGuard)
  @MessagePattern('initiate_payment')
  async initiatePayment(@Payload() createCharge: CreateChargeDto) {
    console.log('called', { createCharge });
    return this.paymentService.initiatePayment(createCharge);
  }
  @UseGuards(JwtAuthGuard)
  @MessagePattern('abort_payment')
  async abortPayment(@Payload() paymentDetails: { paymentId: string }) {
    console.log(paymentDetails);
    return this.paymentService.abortPayment(paymentDetails);
  }
}
