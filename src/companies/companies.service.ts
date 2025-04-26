import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Company, CompanyDocument } from './schemas/company.schema';
import { SoftDeleteModel } from 'mongoose-delete';
import { IUser } from 'src/users/user.interface';
import { SortOrder, Types } from 'mongoose';
import aqp from 'api-query-params';
import { isEmail, isEmpty } from 'class-validator';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company.name)
    private readonly companyModel: SoftDeleteModel<CompanyDocument>,
  ) {}

  async create(createCompanyDto: CreateCompanyDto, user: IUser) {
    // Kiểm tra công ty đã tồn tại chưa
    const existingCompany = await this.companyModel.findOne({
      name: createCompanyDto.name,
    });

    if (existingCompany) {
      throw new BadRequestException('Company already exists');
    }

    // Tạo dữ liệu công ty mới
    const companyData = {
      ...createCompanyDto,
      createdBy: new Types.ObjectId(user._id),
    };

    return await this.companyModel.create(companyData);
  }

  async findAll(page = 1, limit = 10, qs: any) {
    // Tách page và limit ra khỏi qs
    const { page: _page, limit: _limit, ...filteredQs } = qs;

    // Phân tích query params còn lại
    const { filter, sort, projection, population } = aqp(filteredQs);

    const offset = (page - 1) * limit;
    const totalItems = await this.companyModel.countDocuments(filter).exec();
    const totalPages = Math.ceil(totalItems / limit);

    const result = await this.companyModel
      .find(filter, projection)
      .skip(offset)
      .limit(limit)
      .populate(population)
      .sort(sort as any)
      .lean()
      .exec();

    return {
      meta: {
        current: page,
        pageSize: limit,
        pages: totalPages,
        total: totalItems,
      },
      result,
    };
  }

  async findOne(id: string) {
    // Kiểm tra định dạng ID
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid company ID format');
    }

    // Tìm công ty theo ID
    const company = await this.companyModel.findById(id).exec();
    if (!company) {
      throw new NotFoundException('Company not found');
    }
    return company;
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto, user: IUser) {
    // Kiểm tra định dạng ID
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid company ID format');
    }

    // Cập nhật công ty
    const updatedCompany = await this.companyModel.findByIdAndUpdate(
      id,
      {
        ...updateCompanyDto,
        updatedBy: new Types.ObjectId(user._id), // Chỉ lưu _id thay vì toàn bộ đối tượng
      },
      { new: true },
    );

    if (!updatedCompany) {
      throw new NotFoundException('Company not found');
    }

    return updatedCompany;
  }

  async remove(id: string, user: IUser) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid company ID format');
    }

    const deleted = await this.companyModel.delete({ _id: id }, user._id);

    if (!deleted) {
      throw new NotFoundException('Company not found or already deleted');
    }

    return { message: 'Company soft deleted successfully' };
  }
}
