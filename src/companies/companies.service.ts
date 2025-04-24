import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Company, CompanyModel } from './schemas/company.schema';
import { IUser } from 'src/users/user.interface';
import { Types } from 'mongoose';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company.name) private readonly companyModel: CompanyModel,
  ) {}

  async create(createCompanyDto: CreateCompanyDto, user: IUser) {
    const existingCompany = await this.companyModel.findOne({
      name: createCompanyDto.name,
    });

    if (existingCompany) {
      throw new BadRequestException('Company already exists');
    }

    const companyData: Partial<Company> = {
      ...createCompanyDto,
      createdBy: {
        _id: new Types.ObjectId(user._id),
        email: user.email,
      },
    };

    return await this.companyModel.create(companyData);
  }

  findAll() {
    return `This action returns all companies`;
  }

  findOne(id: number) {
    return `This action returns a #${id} company`;
  }

  update(id: number, updateCompanyDto: UpdateCompanyDto) {
    return `This action updates a #${id} company`;
  }

  remove(id: number) {
    return `This action removes a #${id} company`;
  }
}
