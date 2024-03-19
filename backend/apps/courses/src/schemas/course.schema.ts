import { AbstractDocument } from '@app/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export interface LearningJourney {
  image: string;
  title: string;
  description: string;
}

@Schema()
export class Course extends AbstractDocument {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  description: string;

  @Prop({ required: true, trim: true })
  seller: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true, trim: true })
  sub_description: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ required: true })
  image: string;

  @Prop({
    type: [{ image: String, title: String, description: String }],
    default: null,
  })
  learning_journey: LearningJourney[] | null;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
