import { NestFactory } from '@nestjs/core';
import { RolesModule } from './roles.module';
import { Queues, RmqService } from '@app/common';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(RolesModule);
  app.useGlobalPipes(new ValidationPipe());
  const configService = app.get(ConfigService);
  const rmqService = app.get(RmqService);
  app.connectMicroservice(rmqService.getOptions(Queues.ROLES, true));
  app.startAllMicroservices();

  await app.listen(configService.get('PORT'));
}
bootstrap();
