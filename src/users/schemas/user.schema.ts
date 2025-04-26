import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User> & {
  deleted?: boolean; // Trạng thái xóa mềm
  deletedAt?: Date; // Thời gian xóa mềm
  deletedBy?: Types.ObjectId; // Người thực hiện xóa mềm
};

@Schema({ timestamps: true })
export class User {
  @Prop({ unique: true, required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop()
  age: number;

  @Prop()
  gender: string;

  @Prop()
  address: string;

  @Prop({ type: Types.ObjectId, ref: 'Company' })
  company: Types.ObjectId;

  @Prop()
  role: string;

  @Prop()
  refreshToken: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  updatedBy: Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);
