import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

// Định nghĩa kiểu CompanyDocument với các trường từ mongoose-delete
export type CompanyDocument = HydratedDocument<Company> & {
  deleted?: boolean; // Trạng thái xóa mềm
  deletedAt?: Date; // Thời gian xóa mềm
  deletedBy?: Types.ObjectId; // Người thực hiện xóa mềm
};

@Schema({ timestamps: true })
export class Company {
  @Prop({ required: true })
  name: string;

  @Prop()
  address: string;

  @Prop()
  description: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  updatedBy: Types.ObjectId;

  // Trường deletedBy không cần khai báo ở đây vì plugin sẽ tự quản lý
}

export const CompanySchema = SchemaFactory.createForClass(Company);
