import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { SoftDeleteModel } from 'mongoose-delete';
import { CreateUserDto, RegisterDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { IUser } from './user.interface';
import { Types } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: SoftDeleteModel<UserDocument>,
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

  async create(
    dto: RegisterDto | CreateUserDto,
    opts: { isAdmin?: boolean; user?: IUser } = {},
  ) {
    /* 1. Ép quyền / gán mặc định */
    const data: any = { ...dto };

    // Nếu không phải admin => khóa role & company
    if (!opts.isAdmin) {
      data.role = 'user';
      data.company = undefined;
    } else {
      data.createdBy = opts.user._id;
    }

    /* 2. Băm mật khẩu (đừng sửa trực tiếp dto để tránh side-effect) */
    data.password = this.getHashPassword(dto.password);

    /* 3. Thử lưu thẳng, để DB báo lỗi trùng — tránh race condition */
    try {
      const user = await this.userModel.create(data);

      // 4. Ẩn password trước khi trả về
      const { password, ...safe } = user.toObject();
      return safe;
    } catch (err: any) {
      // Duplicate key => 409 Conflict
      if (err.code === 11000 && err.keyPattern?.email) {
        throw new ConflictException('Email already exists');
      }
      throw err; // Ném lại để filter toàn cục xử lý
    }
  }

  findAll(query: any) {
    // skip, limit, sort
    const { skip, limit, sort } = query;
    return this.userModel.find().skip(skip).limit(limit).sort(sort);
  }

  async findOne(id: string) {
    const user = await this.userModel
      .findById(id)
      .select('-password -__v -deleted') // ẩn thêm nếu muốn
      .populate({
        // nếu cần lấy công ty
        path: 'company',
        select: 'name address',
      })
      .populate('createdBy', 'name email -_id')
      .lean() // plain JS object
      .exec();

    if (!user) throw new NotFoundException('User not found');

    return user; // trả về object KHÔNG password
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userModel.findOne({ email });
  }

  comparePassword(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash);
  }

  async update(id: string, dto: UpdateUserDto, user: IUser) {
    // 1) chặn đổi mật khẩu (nếu cần)
    const { password, ...rest } = dto;

    // 2) lọc undefined và gộp updatedBy / updatedAt
    const payload: Record<string, any> = Object.fromEntries(
      Object.entries(rest).filter(([_, v]) => v !== undefined),
    );

    payload.updatedBy = new Types.ObjectId(user._id);

    // 3) updateOne
    const result = await this.userModel.updateOne(
      { _id: id, deleted: { $ne: true } },
      { $set: payload },
    );

    if (result.matchedCount === 0) {
      throw new NotFoundException('User not found');
    }

    return result; // { acknowledged, matchedCount, modifiedCount, … }
  }

  async remove(id: string, user: IUser) {
    if (!Types.ObjectId.isValid(id))
      throw new BadRequestException('Invalid id');

    const res = await this.userModel.delete({ _id: id }, user._id);

    if (res.deletedCount === 0) throw new NotFoundException('User not found');

    return {
      acknowledged: res.acknowledged,
      deletedCount: res.deletedCount,
      deletedAt: new Date(), // nếu plugin không tự thêm
      deletedBy: user._id,
    };
  }
}
