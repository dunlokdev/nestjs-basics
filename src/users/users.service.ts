import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const createCat = await this.userModel.create(createUserDto);

    return createCat;
  }

  findAll(query: any) {
    // skip, limit, sort
    const { skip, limit, sort } = query;
    return this.userModel.find().skip(skip).limit(limit).sort(sort);
  }

  findOne(id: number) {
    return this.userModel.findOne({ _id: id });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userModel.updateOne({ _id: id }, updateUserDto);
  }

  remove(id: number) {
    return this.userModel.deleteOne({ _id: id });
  }
}
