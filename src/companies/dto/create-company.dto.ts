import { IsEmpty, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCompanyDto {
  @IsString({ message: 'Tên công ty phải là chuỗi' })
  @IsNotEmpty({ message: 'Tên công ty không được để trống' })
  name: string;

  @IsString({ message: 'Địa chỉ công ty phải là chuỗi' })
  @IsNotEmpty({ message: 'Địa chỉ công ty không được để trống' })
  address: string;

  @IsString({ message: 'Mô tả công ty phải là chuỗi' })
  @IsOptional()
  description?: string;
}
