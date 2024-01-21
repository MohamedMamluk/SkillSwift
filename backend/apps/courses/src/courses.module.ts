import { Module } from '@nestjs/common';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { DatabaseModule } from '@app/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { CoursesRepository } from './courses.repository';
import { Course, CourseSchema } from './schemas/course.schema';
@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([{ schema: CourseSchema, name: Course.name }]),
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        MONGO_URI: Joi.string().required(),
        PORT: Joi.string().required(),
      }),
    }),
  ],
  controllers: [CoursesController],
  providers: [CoursesService, CoursesRepository],
})
export class CoursesModule {}
