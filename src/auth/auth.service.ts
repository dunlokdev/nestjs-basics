import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

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

  async login(user: any) {
    const payload = { username: user.email, name: user.name, sub: user._id };
    console.log(payload);
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
