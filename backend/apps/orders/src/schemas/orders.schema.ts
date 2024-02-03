import { AbstractDocument } from '@app/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as SchemaTypes } from 'mongoose';

@Schema({ timestamps: true })
export class Order extends AbstractDocument {
  @Prop({ required: true })
  price: number;

  @Prop({ required: true, type: SchemaTypes.Types.ObjectId })
  seller: SchemaTypes.Types.ObjectId;

  @Prop({ required: true, type: SchemaTypes.Types.ObjectId })
  buyer: SchemaTypes.Types.ObjectId;

  @Prop({ required: true, type: SchemaTypes.Types.ObjectId })
  course: SchemaTypes.Types.ObjectId;

  @Prop({ required: true })
  transactionId: string;

  @Prop({ required: true, type: SchemaTypes.Types.Mixed })
  additionalInfo: any;
}

export const orderSchema = SchemaFactory.createForClass(Order);
