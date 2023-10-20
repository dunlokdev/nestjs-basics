import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  getHashPassword(password: string) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
  }

  async isExist(email: string): Promise<boolean> {
    const user = await this.userModel.findOne({ email });
    return user ? true : false;
  }

  async create(createUserDto: CreateUserDto) {
    if (await this.isExist(createUserDto.email)) {
      throw new HttpException(
        'Account is already exist, please try again',
        400,
      );
    }

    const { password } = createUserDto;
    createUserDto.password = this.getHashPassword(password);

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

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userModel.findOne({ email });
  }

  comparePassword(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userModel.updateOne({ _id: id }, updateUserDto);
  }

  remove(id: number) {
    return this.userModel.deleteOne({ _id: id });
  }
}
