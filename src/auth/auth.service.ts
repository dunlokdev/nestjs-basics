import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from 'src/users/dto/create-user.dto';
import { IUser } from 'src/users/user.interface';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);

    if (!user) return null;

    const isMatch = await this.usersService.comparePassword(
      pass,
      user.password,
    );

    return isMatch ? user : null;
  }

  async login(user: IUser) {
    const { _id, name, email, role } = user;

    const payload = {
      sub: 'token login',
      iss: 'from server',
      _id,
      name,
      email,
      role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      _id,
      name,
      email,
      role,
    };
  }

  async register(body: RegisterDto) {
    const { _id, createdAt } = await this.usersService.create(body);
    return { _id, createdAt };
  }
}
