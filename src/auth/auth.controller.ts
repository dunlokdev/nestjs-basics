import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Public } from 'src/decorator/customize';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { RegisterDto } from 'src/users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Get('')
  getHello(@Request() req) {
    return {
      message: 'Hello World',
      user: req.user,
    };
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Post('/register')
  @Public()
  async register(@Body() user: RegisterDto) {
    return this.authService.register(user);
  }
}
