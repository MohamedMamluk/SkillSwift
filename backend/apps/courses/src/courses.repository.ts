import { AbstractRepository } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { Course } from './schemas/course.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class CoursesRepository extends AbstractRepository<Course> {
  protected readonly logger = new Logger(CoursesRepository.name);

  constructor(@InjectModel(Course.name) CourseModel: Model<Course>) {
    super(CourseModel);
  }
}
