import { IsEmail, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Tên không được để trống' })
  name: string;

  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  password: string;

  @IsOptional()
  phone: string;

  @IsOptional()
  address: string;

  @IsNotEmpty({ message: 'Tuổi không được để trống' })
  age: number;

  @IsNotEmpty({ message: 'Giới tính không được để trống' })
  gender: string;

  @IsNotEmpty({ message: 'Vai trò không được để trống' })
  role: string;

  @IsOptional()
  company: Types.ObjectId;
}

export class RegisterDto {
  @IsNotEmpty({ message: 'Tên không được để trống' })
  name: string;

  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  password: string;

  @IsOptional()
  phone: string;

  @IsOptional()
  address: string;

  @IsNotEmpty({ message: 'Tuổi không được để trống' })
  age: number;
}
