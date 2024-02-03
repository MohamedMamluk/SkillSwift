import { CardDto } from '@app/common';
import { Type } from 'class-transformer';
import {
  IsDefined,
  IsMongoId,
  IsNotEmptyObject,
  ValidateNested,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateOrderDto {
  @IsMongoId()
  courseId: Types.ObjectId;
  @IsDefined()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CardDto)
  card: CardDto;
}
