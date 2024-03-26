import { Module } from '@nestjs/common';
import { AuthModule, DatabaseModule, RmqModule } from '@app/common';

import { ConfigModule } from '@nestjs/config';

import * as Joi from 'joi';

import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';

@Module({
  imports: [
    DatabaseModule,
    // DatabaseModule.forFeature([{ schema: CourseSchema, name: Course.name }]),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGO_URI: Joi.string().required(),
        PORT: Joi.string().required(),
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_AUTH_QUEUE: Joi.string().required(),
      }),
    }),
    RmqModule,
    AuthModule,
  ],
  controllers: [RolesController],
  providers: [RolesService],
})
export class RolesModule {}
