import { BadRequestException, Injectable } from '@nestjs/common';
import { CoursesRepository } from './courses.repository';
import { CourseDto } from './dto/course.dto';
import mongoose from 'mongoose';
import { User } from '@app/common';

@Injectable()
export class CoursesService {
  constructor(private readonly coursesRepo: CoursesRepository) {}
  async create(courseDetails: CourseDto, user: User) {
    return this.coursesRepo.create({ ...courseDetails, seller: user._id });
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
