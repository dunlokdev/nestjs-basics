import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';

export type UserDocument = HydratedDocument<User>;
export type UserModel = SoftDeleteModel<UserDocument>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  name: string;

  @Prop()
  phone: string;

  @Prop()
  address: string;

  @Prop()
  age: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
