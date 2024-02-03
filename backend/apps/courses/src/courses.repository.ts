import { AbstractRepository } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { Course } from './schemas/course.schema';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';

@Injectable()
export class CoursesRepository extends AbstractRepository<Course> {
  protected readonly logger = new Logger(CoursesRepository.name);

  constructor(
    @InjectModel(Course.name) CourseModel: Model<Course>,
    @InjectConnection() connection: Connection,
  ) {
    super(CourseModel, connection);
  }
}
