import { NestFactory } from '@nestjs/core';
import { PaymentModule } from './payment.module';
import { Queues, RmqService } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(PaymentModule);
  const rmqService = app.get(RmqService);
  app.connectMicroservice(rmqService.getOptions(Queues.PAYMENT, true));
  await app.startAllMicroservices();
}
bootstrap();
