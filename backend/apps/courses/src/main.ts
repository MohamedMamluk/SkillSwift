import { NestFactory } from '@nestjs/core';
import { CoursesModule } from './courses.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Queues, RmqService } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(CoursesModule);
  app.useGlobalPipes(new ValidationPipe());
  const configService = app.get(ConfigService);
  const rmqService = app.get(RmqService);
  app.connectMicroservice(rmqService.getOptions(Queues.COURSES, true));
  app.startAllMicroservices();

  await app.listen(configService.get('PORT'));
}
bootstrap();
