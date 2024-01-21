import { BadRequestException, Injectable } from '@nestjs/common';
import { CoursesRepository } from './courses.repository';
import { CourseDto } from './dto/course.dto';
import mongoose from 'mongoose';

@Injectable()
export class CoursesService {
  constructor(private readonly coursesRepo: CoursesRepository) {}
  async create(courseDetails: CourseDto) {
    return this.coursesRepo.create(courseDetails);
  }
  async findOne(courseId: string) {
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      throw new BadRequestException(
        'Please make sure that the id is a valid courseId',
      );
    }
    return this.coursesRepo.findOne({ _id: courseId });
  }
  async findAll() {
    return this.coursesRepo.find({});
  }
}
