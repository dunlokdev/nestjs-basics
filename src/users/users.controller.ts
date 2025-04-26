import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUser } from './user.interface';
import { Public, User } from 'src/decorator/customize';
import { ResponseMessage } from 'src/decorator/response-message.decorator';
import { ParseObjectIdPipe } from 'src/pipes/parse-object-id.pipe';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ResponseMessage('Tạo người dùng thành công')
  async create(@Body() dto: CreateUserDto, @User() user: IUser) {
    const { _id, createdAt } = await this.usersService.create(dto, {
      isAdmin: true,
      user,
    });
    return { _id, createdAt };
  }

  @Get()
  @ResponseMessage('Lấy danh sách người dùng thành công')
  findAll(@Body() query: any) {
    return this.usersService.findAll(query);
  }

  @Public()
  @Get(':id')
  @ResponseMessage('Lấy thông tin người dùng thành công')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật thông tin người dùng thành công')
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
    @User() user: IUser,
  ) {
    return this.usersService.update(id, updateUserDto, user);
  }

  @Delete(':id')
  @ResponseMessage('Xóa người dùng thành công')
  remove(@Param('id', ParseObjectIdPipe) id: string, @User() user: IUser) {
    return this.usersService.remove(id, user);
  }
}
