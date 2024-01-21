import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { LearningJourney } from '../schemas/course.schema';

export class CourseDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  sub_description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsString()
  @IsNotEmpty()
  image: string;

  @IsOptional()
  learning_journey: LearningJourney[] | null;
}
