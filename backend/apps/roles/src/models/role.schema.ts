import { AbstractDocument } from '@app/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Role extends AbstractDocument {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, min: 1 })
  level: number;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
