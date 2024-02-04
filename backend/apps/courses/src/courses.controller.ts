import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CourseDto } from './dto/course.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CurrentUser, JwtAuthGuard, User } from '@app/common';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createCourse(
    @Body() courseDetails: CourseDto,
    @CurrentUser() user: User,
  ) {
    return this.coursesService.create(courseDetails, user);
  }
  @Get(':id')
  @MessagePattern('get_course')
  async findCourse(
    @Payload() payload: { _id: string },
    @Param('id') courseId: string,
  ) {
    return this.coursesService.findOne(courseId || payload._id);
  }
  @Get()
  async findAll() {
    return this.coursesService.findAll();
  }
}
