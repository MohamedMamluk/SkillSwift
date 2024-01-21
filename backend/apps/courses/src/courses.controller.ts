import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CourseDto } from './dto/course.dto';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  async createCourse(@Body() courseDetails: CourseDto) {
    return this.coursesService.create(courseDetails);
  }
  @Get(':id')
  async findCourse(@Param('id') courseId: string) {
    return this.coursesService.findOne(courseId);
  }
  @Get()
  async findAll() {
    return this.coursesService.findAll();
  }
}
