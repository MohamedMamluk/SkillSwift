import { AbstractDocument } from '@app/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
@Schema({ timestamps: true })
export class User extends AbstractDocument {
  @Prop({ default: null })
  image: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ default: [] })
  achievements: string[];

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  phoneNumber: string;
}

export const userDocument = SchemaFactory.createForClass(User);

userDocument.pre('save', async function () {
  if (!this.isNew) {
    return;
  }
  const hashedPassword = await bcrypt.hash(this.password, 12);

  this.password = hashedPassword;
});
